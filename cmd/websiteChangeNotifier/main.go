package main

import (
	"flag"
	"fmt"
	"log"
	"os"
	"time"

	wcn "github.com/ashkanjj/go-websiteChangeNotifier"
)

var (
	url             = flag.String("url", "", "URL to load")
	emailConfigFile = flag.String("config", "", "Config file")
	snapshotFolder  = flag.String("snapshotFolder", "", "Snapshot folder")
)

func main() {

	dir, err := os.Getwd()

	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("dir", dir)

	flag.Parse()

	if *url == "" {
		log.Fatal("Need the url")
	}

	if *emailConfigFile == "" {
		log.Fatal("Need the config file")
	}

	if *snapshotFolder == "" {
		log.Fatal("Need the snapshot folder")

	}

	// Initially fetch address' body
	fetcher := wcn.Fetcher{Url: *url}
	htmlBody, err := fetcher.Fetch()

	if err != nil {
		log.Fatal(err)
	}

	snapshot, err := wcn.NewSnapshot(*snapshotFolder, *url)

	if err != nil {
		log.Fatal(err)
	}

	log.Println("Web URL:", *url)

	if saveError := snapshot.Save(htmlBody); saveError != nil { //save the body of what was returned
		log.Fatal("Error initially saving the file", saveError.Error())
	}

	// Load email configuration
	emailConfig := wcn.EmailConfig(*emailConfigFile)

	email, emailSetupError := wcn.NewEmailService(&emailConfig)

	if emailSetupError != nil {
		log.Fatal("Email setup error", emailSetupError)
	}

	wcn.Process(&fetcher, &snapshot, email, time.Second*5, false)
}
