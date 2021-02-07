package bolt

import (
	"time"
)

type Snapshot struct {
	ID string
	WebsiteID string
	Date      time.Time
	Value     string
}
