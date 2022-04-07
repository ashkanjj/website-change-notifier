package monitoring

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strings"
	"sync"
	"time"

	"github.com/ashkanjj/website-change-notifier/monitoring-daemon/core"
)

type repository interface {
	CreateSnapshotForURL(userId int, url string, body string) error
	GetAllURLs() ([]core.URL, error)
	GetAllSnapshotsForURL(url string, userId int) ([]core.Snapshot, error)
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
		wg.Add(1)
		go startScrapperProcess(url, s.r, done)

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

func startScrapperProcess(url core.URL, r repository, done chan bool) {
	interval := time.Second * 5
	ticker := time.NewTicker(interval)

	fmt.Println("visiting:", url)
	for {
		select {
		case <-done:
			fmt.Println("Done channel called!")
			return
		case <-ticker.C:
			fmt.Println(fmt.Sprintf("tick %s", url))
			res, err := http.Get(url.Sk)
			if err != nil {
				log.Fatal(err)
			}
			defer res.Body.Close()
			if res.StatusCode != 200 {
				log.Fatalf("status code error: %d %s", res.StatusCode, res.Status)
			}

			buf, err := ioutil.ReadAll(res.Body)

			if err != nil {
				log.Fatal("failed to read into buffer", err)
			}
			body := string(buf)
			fmt.Println("got the body", strings.Count("html", body))

			snapshots, err := r.GetAllSnapshotsForURL(url.Sk, url.UserId)

			if err != nil {
				log.Fatal("failed to get all snapshots", err)
			}

			if len(snapshots) == 0 {
				fmt.Println("creating snapshot..")
				err := r.CreateSnapshotForURL(url.UserId, url.Sk, body)

				if err != nil {
					log.Fatal("failed to create snapshot for the first time", err)
				}
			} else {
				fmt.Println("there are snapshots", len(snapshots))
				fmt.Println("compare the last snapshot with the new body to see if there is any change")
				// if there is a change, add 

			}

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
