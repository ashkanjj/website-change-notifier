package websiteChangeNotifier

import (
	"testing"
)

func TestSnapshot(t *testing.T) {
	webID := "websiteId"
	mockContent := "content"
	store := InMemoryStore{data: nil}
	snapshot := NewSnapshot(webID, &store)

	snapshot.Save(mockContent)

	latest, err := snapshot.ReadLatest()

	if err != nil {
		t.Fatal("error reading the latest snapshot")
	}

	if latest != mockContent {
		t.Fatal("latest snapshot is not correct")
	}
}

type KeyValue struct {
	key   string
	value string
}

type InMemoryStore struct {
	data []KeyValue
}

func (s *InMemoryStore) SaveSnapshot(key string, value string) error {
	s.data = append(s.data, KeyValue{key, value})
	return nil
}

func (s *InMemoryStore) LatestSnapshot(prefix string) (string, error) {
	return s.data[0].value, nil // last item
}

func (s *InMemoryStore) CreateWebsite(key string, value string) error {
	return nil
}
