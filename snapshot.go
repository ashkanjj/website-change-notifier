package websiteChangeNotifier

import (
	"fmt"
	"io/ioutil"
	"path/filepath"
	"time"

	bolt "go.etcd.io/bbolt"
)

const DateFormat = "2006-01-02T15:04:05Z07:00"

// Snapshot is the representation of Snapshot functionality related to a specific website id
type Snapshot struct {
	DB        *bolt.DB
	websiteID string
	Directory string
}

// NewSnapshot creates a new instance of Snapshot
func NewSnapshot(websiteID string, db *bolt.DB) Snapshot {
	return Snapshot{websiteID: websiteID, DB: db}
}

func (s Snapshot) ReadLatest() (string, error) {
	latestSnap := s.path("latest")
	content, err := ioutil.ReadFile(latestSnap)
	return string(content), err
}

// Save will save the passed in content along with the current RFC3339 datetime format
func (s Snapshot) Save(content string) error {
	c := []byte(content)

	now := time.Now().Format(DateFormat)

	err := s.DB.Update(func(tx *bolt.Tx) error {
		b, err := tx.CreateBucketIfNotExists([]byte("Snapshot"))
		if err != nil {
			return err
		}
		key := fmt.Sprintf("%s:%s", s.websiteID, now)
		return b.Put([]byte(key), c)
	})

	return err
}

func (s Snapshot) path(filename string) string {
	p := filepath.Join(s.Directory, filename)
	return p
}
