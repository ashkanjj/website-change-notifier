package monitoring

type Service struct {

}


func NewService() *Service {
	return &Service{}
}


func (s *Service) Process() {

	println("process started...")

}