package listing

type Repository interface {
	LatestSnapshot(prefix string) (Snapshot, error)
	GetAllWebsites() ([]Website, error)
}

type Service struct {
	r Repository
}

func NewService(r Repository) *Service {
	return &Service{r}
}

func (s *Service) ReadLatestSnapshot(webId string) (Snapshot, error) {
	return s.r.LatestSnapshot(webId)
}

func (s *Service) GetWebsites() ([]Website, error) {
	return s.r.GetAllWebsites()
}
