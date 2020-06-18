package main

import (
	"flag"
	"fmt"
	"github.com/gosimple/slug"
	"github.com/sergi/go-diff/diffmatchpatch"
	"log"
	"regexp"
	"time"
)

var configFile = "./config.json" //TODO check how other delcare their consts

func main() {
	var url = flag.String("url", "", "URL to load")
	flag.Parse()

	if *url == "" {
		log.Fatal("Need the url")
	}

	// Load configuration
	config, configError := ConfigFile(configFile).Parse()
	if configError != nil {
		log.Fatal("Failed to parse the config file", configError)
	}
	var recipients []Recipient

	for i := 0; i < len(config.Recipients); i++ {
		recipients = append(recipients, Recipient{Name: config.Recipients[i].Name, Email: config.Recipients[i].Email})
	}

	snapshotFile := "./" + slug.Make(*url) // make the url friendly for storage

	snapshot := Snapshot{directory: "./snapshots", src: snapshotFile}

	email := EmailService{recipients: recipients, fromEmail: config.FromEmail}

	// Initially fetch address' body
	f := Fetcher{url: *url}
	htmlBody, err := f.Content()
	if err != nil {
		log.Fatal(err)
	}
	saveError := snapshot.SaveFile(htmlBody)
	log.Println("Web URL:", *url)
	if saveError != nil {
		log.Fatal("Error initially saving the file", err.Error())
	}

	ticker := time.NewTicker(time.Second * 5)

	done := make(chan bool)

	dmp := diffmatchpatch.New()

	for {
		select {
		case <-done:
			fmt.Println("Done channel called!")
		case <-ticker.C:
			fmt.Println("tick")
			htmlBody, err := f.Content()
			if err != nil {
				log.Print(err)
				return
			}
			fileContent, err := snapshot.ReadFile()
			if err != nil {
				log.Print("Error reading the file", err.Error())
				return
			}
			hb := cleanup(htmlBody)
			fc := cleanup(fileContent)
			if hb != fc {
				log.Println("Body has changed...inform the user")
				diffs := dmp.DiffMain(fc, hb, false)
				plainTextDiff := dmp.DiffPrettyText(diffs)
				htmlDiff := dmp.DiffPrettyHtml(diffs)
				email.Send("Website change notifier", plainTextDiff, htmlDiff)
				// overwrite the file.
				snapshot.SaveFile(hb)
				break
			} else {
				log.Println("No change")
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
