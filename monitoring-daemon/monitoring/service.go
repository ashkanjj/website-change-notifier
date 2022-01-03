package monitoring

import (
	"fmt"

	"github.com/ashkanjj/website-change-notifier/monitoring-daemon/core"
)


type repository interface {
	GetAllURLs() ([]core.URL, error)
}

type Service struct {
	r repository
}


func NewService(r repository) *Service {
	return &Service{r}
}


func (s *Service) Process() {

	println("process started...")


	urls, err := s.r.GetAllURLs()

	if err != nil {
		fmt.Println("error getting all URLs")
	}

	for _, url := range urls {
		fmt.Println("url", url.Sk)
	}
	// get all websites

	// start a goroutines for each registered website

	// inside the goroutines start hitting the website every 5 seconds and go through the monitoring routine


	

}