package bolt

import (
	"bytes"
	"fmt"
	"regexp"
	"sort"
	"strings"
	"time"

	"github.com/ashkanjj/go-websiteChangeNotifier/pkg/adding"
	"github.com/ashkanjj/go-websiteChangeNotifier/pkg/listing"
	"github.com/boltdb/bolt"
)

// Storage struct
type Storage struct {
	db *bolt.DB
}

// UTCFormat is used for date parse/formatting
const UTCFormat = "2006-01-02T15:04:05Z07:00"

// SortByDate is used for sorting snapshots
type SortByDate []Snapshot

// NewStorage will return an instance of Storage
func NewStorage(db string) (*Storage, error) {
	var dbPath string
	if db != "" {
		dbPath = db
	} else {
		dbPath = "my.db"
	}
	connection, err := bolt.Open(dbPath, 0600, nil)

	return &Storage{connection}, err
}

// Close will will close the Storage
func (d *Storage) Close() {
	d.Close()
}

// CreateWebsite creates a website
func (d *Storage) CreateWebsite(w adding.Website) error {
	return d.db.Update(func(tx *bolt.Tx) error {
		b, err := tx.CreateBucketIfNotExists([]byte("Website"))
		if err != nil {
			return err
		}
		err = b.Put([]byte(w.ID), []byte(w.URL))
		return err
	})
}

// GetWebsite returns a single website
func (d *Storage) GetWebsite(id string) (listing.Website, error) {
	var url string
	err := d.db.View(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte("Website"))

		v := b.Get([]byte(id))
		url = string(v)
		return nil
	})

	return listing.Website{ID: id, URL: url}, err
}

// GetAllWebsites returns all websites stored
func (d *Storage) GetAllWebsites() ([]listing.Website, error) {
	var websites []listing.Website

	err := d.db.View(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte("Website"))

		c := b.Cursor()

		for k, v := c.First(); k != nil; k, v = c.Next() {
			websites = append(websites, listing.Website{ID: string(k), URL: string(v)})
		}

		return nil
	})

	if err != nil {
		return nil, err
	}

	return websites, nil
}

// CreateSnapshot creates a snapshot
func (d *Storage) CreateSnapshot(s adding.Snapshot) error {
	return d.db.Update(func(tx *bolt.Tx) error {
		b, err := tx.CreateBucketIfNotExists([]byte("Snapshot"))
		if err != nil {
			return err
		}
		fmt.Println("value?", s.Value)
		return b.Put(d.createSnapshotKey(s), []byte(s.Value))
	})

}

// GetAllWebsiteSnapshots will return all snapshots associated with a website
func (d *Storage) GetAllWebsiteSnapshots(webID string) ([]listing.Snapshot, error) {
	var s []Snapshot
	var snapshots []listing.Snapshot
	err := d.db.View(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte("Snapshot"))
		c := b.Cursor()

		id := []byte(webID)

		for k, v := c.Seek([]byte(id)); k != nil && bytes.HasPrefix(k, id); k, v = c.Next() {
			snapshot, err := d.parseKeyValueAsSnapshot(k, v)
			if err != nil {
				return err
			}
			s = append(s, snapshot)
		}

		return nil

	})

	for _, v := range snapshots {
		snapshots = append(snapshots, listing.Snapshot{Value: v.Value, Date: v.Date, WebsiteID: v.WebsiteID})
	}

	return snapshots, err
}

// LatestSnapshot returns the latest snapshot given a prefix (websiteId)
func (d *Storage) LatestSnapshot(prefix string) (listing.Snapshot, error) {
	var snapshots []Snapshot
	err := d.db.View(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte("Snapshot"))
		c := b.Cursor()

		pr := []byte(prefix)
		for k, v := c.Seek([]byte(pr)); k != nil && bytes.HasPrefix(k, pr); k, v = c.Next() {
			snapshot, err := d.parseKeyValueAsSnapshot(k, v)
			if err != nil {
				return err
			}
			snapshots = append(snapshots, snapshot)
		}
		return nil
	})

	if err != nil {
		return listing.Snapshot{}, err
	}
	sort.Sort(SortByDate(snapshots))
	fmt.Printf("sorted %s", snapshots)

	s := listing.Snapshot{WebsiteID: snapshots[0].WebsiteID, Date: snapshots[0].Date, Value: snapshots[0].Value}

	return s, nil
}

func (a SortByDate) Len() int { return len(a) }
func (a SortByDate) Swap(i, j int) {
	a[i], a[j] = a[j], a[i]
}
func (a SortByDate) Less(i, j int) bool {
	return a[i].Date.After(a[j].Date)
}

// CreateSnapshotKey creates a snapshot key
func (d *Storage) createSnapshotKey(s adding.Snapshot) []byte {
	nowFormatted := s.Date.Format(UTCFormat)
	return []byte(fmt.Sprintf("%s:%s", s.WebsiteID, nowFormatted))
}

// ParseKeyValueAsSnapshot parses key and value as listing.Snapshot or throws an error when there is a parsing issue
func (d *Storage) parseKeyValueAsSnapshot(key []byte, value []byte) (Snapshot, error) {
	webID := regexp.MustCompile(".+?:").FindString(string(key))
	r := strings.NewReplacer(webID, "")
	timePortionOfKey := r.Replace(string(key))
	parsedTime, err := time.Parse(UTCFormat, string(timePortionOfKey))
	if err != nil {
		return Snapshot{}, err
	}

	return Snapshot{WebsiteID: webID, Date: parsedTime, Value: string(value)}, nil

}
