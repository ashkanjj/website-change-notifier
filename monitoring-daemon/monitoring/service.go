package monitoring

import (
	"fmt"
	"log"
	"net/http"
	"sync"
	"time"

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
	var wg sync.WaitGroup

	urls, err := s.r.GetAllURLs()

	if err != nil {
		fmt.Println("error getting all URLs", err)
	}

	// what is missing from this is that somehow we need to keep polling for new websites

	done := make(chan bool)

	for _, url := range urls {
		fmt.Println("visiting:", url.Sk)
		wg.Add(1)
		go startScrapperProcess(url.Sk, done)

	}

	wg.Wait()

	// use for to forever loop over channels
	// first phase:
	// get all websites
	// start a goroutines for each registered website
	// call fakeScrapper for each url and just print the result

	// second phase:
	// get all websites
	// start a goroutines for each registered website
	// inside the goroutines start hitting the website every 5 seconds and go through the monitoring routine

}

func startScrapperProcess(url string, done chan bool) {
	interval := time.Second * 5
	ticker := time.NewTicker(interval)

	for {
		select {
		case <-done:
			fmt.Println("Done channel called!")
			return
		case <-ticker.C:
			fmt.Println(fmt.Sprintf("starting ticking for url %s", url))
			res, err := http.Get(url)
			if err != nil {
				log.Fatal(err)
			}
			defer res.Body.Close()
			if res.StatusCode != 200 {
				log.Fatalf("status code error: %d %s", res.StatusCode, res.Status)
			}
			fmt.Println("we got body", res.Body)
			// get the full html
			// compare with last snapshot
			// if different (when excluding any exclusion)
			// create a new snapshot and notify the user

		}
	}

}

func fakeScrapper(url string, index int) string {
	return fmt.Sprintf("<html><head></head><body><p>Fake HTML with the random index of %d</p></body></html>", index)
}
