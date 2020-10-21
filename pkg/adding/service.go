package adding

import (
	"time"

	"github.com/gosimple/slug"
)

const UTCFormat = "2006-01-02T15:04:05Z07:00"

type Service struct {
	r Repository
}

type Repository interface {
	CreateWebsite(Website) error
	CreateSnapshot(Snapshot) error
}

func NewService(r Repository) *Service {
	return &Service{r: r}
}

func (s *Service) AddWebsite(url string) (Website, error) {
	id := s.createWebsiteID(url)

	err := s.r.CreateWebsite(Website{ID: id, URL: url})

	return Website{ID: id, URL: url}, err
}

func (s *Service) AddSnapshot(webId string, content string) error {
	snapshot := Snapshot{WebsiteID: webId, Date: time.Now(), Value: content}
	err := s.r.CreateSnapshot(snapshot)
	return err
}

func (s *Service) createWebsiteID(url string) string {
	// create a directory for the snapshot if one doesn't exist
	slug := slug.Make(url) // sluggify the input url for use as a folder name
	var slugNameMaxChar int
	if len(slug) < 30 {
		slugNameMaxChar = len(slug)
	} else {
		slugNameMaxChar = 30
	}
	slug = slug[0:slugNameMaxChar] // limit the length to 30 to avoid long file names
	return slug
}
