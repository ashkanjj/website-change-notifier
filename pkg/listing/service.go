package listing

type Repository interface {
	LatestSnapshot(prefix string) (Snapshot, error)
	GetAllWebsites() ([]Website, error)
	GetAllWebsiteSnapshots(webID string) ([]Snapshot, error)
}

type Service struct {
	r Repository
}

func NewService(r Repository) *Service {
	return &Service{r}
}

func (s *Service) ReadLatestSnapshot(webID string) (Snapshot, error) {
	return s.r.LatestSnapshot(webID)
}

func (s *Service) GetWebsites() ([]Website, error) {
	return s.r.GetAllWebsites()
}

func (s *Service) GetSnapshotsByWebsite(webID string) ([]Snapshot, error) {
	return s.r.GetAllWebsiteSnapshots(webID)
}
