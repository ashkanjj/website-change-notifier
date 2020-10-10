package websiteChangeNotifier

import (
	"fmt"
	"time"
)

const DateFormat = "2006-01-02T15:04:05Z07:00"

// Snapshot is the representation of Snapshot functionality related to a specific website id
type Snapshot struct {
	WebsiteID string
	Store     Store
}

// NewSnapshot creates a new instance of Snapshot
func NewSnapshot(websiteID string, store Store) *Snapshot {
	return &Snapshot{WebsiteID: websiteID, Store: store}
}

func (s *Snapshot) ReadLatest() (string, error) {
	content, err := s.Store.LatestSnapshot(s.WebsiteID)
	if err != nil {
		return "", err
	}
	return string(content), nil
}

// Save will save the passed in content along with the current RFC3339 datetime format
func (s *Snapshot) Save(content string) error {

	now := time.Now().Format(utcFormat)

	key := fmt.Sprintf("%s:%s", s.WebsiteID, now)
	err := s.Store.SaveSnapshot(key, content)

	return err
}
