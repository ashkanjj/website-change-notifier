package listing

import "time"

type Snapshot struct {
	ID string `json:"id"`
	WebsiteID string `json:"websiteId"`
	Date      time.Time `json:"date"`
	Value     string `json:"value"`
}
