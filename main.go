package main

import (
	"fmt"
	"github.com/gosimple/slug"
	"github.com/sergi/go-diff/diffmatchpatch"
	"log"
	"time"
)

// parse the address from cli
// if no snapshot has been created for the address, create the file
// timer code every 5 second
// -- fetch the body of the website
// -- read file and if no file for this address, create it with the content
// -- compare the content of the body with what's stored
func main() {

	address := "http://localhost:8000/"
	// address := "https://www.swedenabroad.se/en/about-abroad-for-swedish-citizens/united-kingdom/service-to-swedish-citizens/passport-abroad/passports-for-adults/"
	snapshotFile := "./" + slug.Make(address)

	snapshot := Snapshot{directory: "./snapshots", src: snapshotFile}
	recipients := make([]Recipient, 2)
	recipients[0] = Recipient{name: "Ash Shahabi", email: "ashkanshahabi@gmail.com"}
	recipients[1] = Recipient{name: "maneli", email: "manelishahabi@gmail.com"}

	fromEmail := Recipient{name: "Ash Shahabi", email: "ashshahabi1@gmail.com"}
	email := EmailService{recipients: recipients, fromEmail: fromEmail}
	err := snapshot.SaveFile("") // create or overwrite the file with empty content so I can read it later
	if err != nil {
		log.Fatal("error saving the file", err.Error())
	}

	ticker := time.NewTicker(time.Second * 5)

	done := make(chan bool)

	dmp := diffmatchpatch.New()

	for {
		select {
		case <-done:
			fmt.Println("done..why would this be called?")
		case t := <-ticker.C:
			fmt.Println("tick", t)
			f := Fetcher{url: address}
			htmlBody, err := f.Content()
			if err != nil {
				log.Print(err)
				return
			}
			fileContent, err := snapshot.ReadFile()
			if err != nil {
				log.Print("error reading the file", err.Error())
				return
			}
			if len(fileContent) == 0 {
				// empty file therefore nothing to compare, save the fileContent instead
				log.Println("empty file...saving htmlBody instead")
				snapshot.SaveFile(htmlBody)
			} else {
				if htmlBody != fileContent {
					log.Println("body has changed...inform the user")
					diffs := dmp.DiffMain(fileContent, htmlBody, false)
					plainTextDiff := dmp.DiffPrettyText(diffs)
					htmlDiff := dmp.DiffPrettyHtml(diffs)
					email.Send("Website change notifier", plainTextDiff, htmlDiff)
					log.Println("DONE")
					done <- true
					break
				} else {
					log.Println("body is the same")
				}
			}
		}
	}

}
