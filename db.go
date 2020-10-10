package websiteChangeNotifier

import (
	"bytes"
	"fmt"
	"sort"
	"time"

	bolt "go.etcd.io/bbolt"
)

type Store interface {
	CreateWebsite(key string, value string) error
	LatestSnapshot(prefix string) (string, error)
	SaveSnapshot(key string, value string) error
}

type SnapshotTemp struct {
	Date    time.Time
	Content string
}

type DB struct {
	DB *bolt.DB
}

type SortByDate []SnapshotTemp

const utcFormat = "2006-01-02T15:04:05Z07:00"

func NewDB() (*DB, error) {
	db, err := bolt.Open("my.db", 0600, nil)

	return &DB{db}, err
}

func (d *DB) Close() {
	d.Close()
}

func (d *DB) CreateWebsite(key string, value string) error {
	return d.DB.Update(func(tx *bolt.Tx) error {
		b, err := tx.CreateBucketIfNotExists([]byte("Website"))
		if err != nil {
			return err
		}
		err = b.Put([]byte(key), []byte(value))
		return err
	})
}

func (d *DB) SaveSnapshot(key string, value string) error {
	return d.DB.Update(func(tx *bolt.Tx) error {
		b, err := tx.CreateBucketIfNotExists([]byte("Snapshot"))
		if err != nil {
			return err
		}
		return b.Put([]byte(key), []byte(value))
	})

}

func (d *DB) LatestSnapshot(prefix string) (string, error) {
	var snapshots []SnapshotTemp
	err := d.DB.View(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte("Snapshot"))
		c := b.Cursor()

		pr := []byte(prefix)

		for k, v := c.Seek(pr); k != nil && bytes.HasPrefix(k, pr); k, v = c.Next() {
			timePortionOfKey := bytes.ReplaceAll(k, []byte(fmt.Sprintf("%s:", prefix)), []byte(""))
			pt, err := time.Parse(utcFormat, string(timePortionOfKey))
			if err != nil {
				return err
			}
			snapshots = append(snapshots, SnapshotTemp{Date: pt, Content: string(v)})
		}
		return nil
	})

	if err != nil {
		return "", err
	}
	sort.Sort(SortByDate(snapshots))
	fmt.Printf("sorted %s", snapshots)

	return snapshots[0].Content, nil
}

func (a SortByDate) Len() int { return len(a) }
func (a SortByDate) Swap(i, j int) {
	a[i], a[j] = a[j], a[i]
}
func (a SortByDate) Less(i, j int) bool {
	return a[i].Date.After(a[j].Date)
}
