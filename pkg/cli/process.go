package cli

import (
	"fmt"
	"log"
	"time"

	"github.com/ashkanjj/go-websiteChangeNotifier/pkg/adding"
	"github.com/ashkanjj/go-websiteChangeNotifier/pkg/email"
	"github.com/ashkanjj/go-websiteChangeNotifier/pkg/fetching"
	"github.com/ashkanjj/go-websiteChangeNotifier/pkg/listing"
	"github.com/sergi/go-diff/diffmatchpatch"
)

func Process(adder *adding.Service, lister *listing.Service, emailSender *email.Service, url string, interval time.Duration, terminateOnChange bool) {
	website, err := adder.AddWebsite(url)
	if err != nil {
		log.Fatal("error adding the website")
	}

	fetcher := fetching.NewService(url)

	// Initially fetch the website content
	htmlBody, err := fetcher.Fetch()

	if err != nil {
		log.Fatal("error in fetching the website", err)
	}

	if saveError := adder.AddSnapshot(website.ID, htmlBody); saveError != nil { //save the body of what was returned
		log.Fatal("Error initially saving the content", saveError.Error())
	}

	// Load email configuration
	// emailConfig := wcn.EmailConfig(*emailConfigFile)

	// email, emailSetupError := wcn.NewEmailService(&emailConfig)

	// if emailSetupError != nil {
	// 	log.Fatal("Email setup error", emailSetupError)
	// }

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

			latestSnap, err := lister.ReadLatestSnapshot(website.ID)
			if err != nil {
				log.Print("Error reading the file", err.Error())
				return
			}

			htmlContent, err := fetcher.Fetch()

			if err != nil {
				log.Print("Error fetching the HTML", err)
				return
			}

			hb := cleanup(htmlContent)
			sc := cleanup(latestSnap.Value)

			if hb != sc {
				diffs := dmp.DiffMain(sc, hb, false)
				plainTextDiff := dmp.DiffPrettyText(diffs)
				htmlDiff := dmp.DiffPrettyHtml(diffs)

				log.Println("Body has changed...inform the user")

				emailSender.Send("Website change notifier", plainTextDiff, htmlDiff)

				adder.AddSnapshot(website.ID, hb)
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
