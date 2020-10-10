package websiteChangeNotifier

import (
	"fmt"
	"log"
	"time"

	"github.com/sergi/go-diff/diffmatchpatch"
)

type EmailSender interface {
	Send(subject string, textContent string, htmlContent string) error
}

type FetcherFetch interface {
	Fetch() (string, error)
}

type SnapshotReaderAndSaver interface {
	ReadLatest() (string, error)
	Save(content string) error
}

func Process(f FetcherFetch, snapshot SnapshotReaderAndSaver, email EmailSender, interval time.Duration, terminateOnChange bool) {

	ticker := time.NewTicker(interval)

	done := make(chan bool)
	dmp := diffmatchpatch.New()
	for {
		select {
		case <-done:
			fmt.Println("Done channel called!")
			return
		case <-ticker.C:
			fmt.Println("tick")

			snapshotContent, err := snapshot.ReadLatest()
			if err != nil {
				log.Print("Error reading the file", err.Error())
				return
			}

			htmlContent, err := f.Fetch()

			if err != nil {
				log.Print("Error fetching the HTML", err)
				return
			}

			hb := cleanup(htmlContent)
			sc := cleanup(snapshotContent)

			if hb != sc {
				diffs := dmp.DiffMain(sc, hb, false)
				plainTextDiff := dmp.DiffPrettyText(diffs)
				htmlDiff := dmp.DiffPrettyHtml(diffs)

				log.Println("Body has changed...inform the user")

				email.Send("Website change notifier", plainTextDiff, htmlDiff)

				snapshot.Save(hb)
				fmt.Println("finish")

				if terminateOnChange {
					go func() {
						fmt.Println("should be terminated")
						ticker.Stop()
						done <- true
					}()
				}

				break

			} else {
				log.Println("No change...")
			}

		}
	}
}

func cleanup(str string) string {
	// add a slice of things to cleanup

	// TODO: remove the lines including certain strings using Regex.MustCompile and replaceAllStrings to excludes things like cookie reminders
	// example:
	// re := regexp.MustCompile("(?m)[\r\n]+^.*search-filters-.*$")
	// res := re.ReplaceAllString(str, "")
	return str
}
