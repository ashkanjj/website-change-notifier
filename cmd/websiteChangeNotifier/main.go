package main

import (
	"flag"
	"fmt"
	wcn "github.com/ashkanjj/go-websiteChangeNotifier"
	"github.com/gosimple/slug"
	"log"
	"os"
	"time"
)

var (
	url             = flag.String("url", "", "URL to load")
	emailConfigFile = flag.String("config", "", "Config file")
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

	// Load email configuration
	emailConfig := wcn.EmailConfig(*emailConfigFile)

	email, emailSetupError := wcn.NewEmailService(&emailConfig)

	if emailSetupError != nil {
		log.Fatal("Email setup error", emailSetupError)
	}

	// Initially fetch address' body
	fetcher := wcn.Fetcher{Url: *url}
	htmlBody, err := fetcher.Fetch()
	if err != nil {
		log.Fatal(err)
	}

	snapshotFile := "./" + slug.Make(*url) // sluggify the input url for use as a file name
	snapshot := wcn.Snapshot{Directory: "../../snapshots", Src: snapshotFile}

	saveError := snapshot.SaveFile(htmlBody)
	log.Println("Web URL:", *url)
	if saveError != nil {
		log.Fatal("Error initially saving the file", saveError.Error())
	}

	wcn.Process(&fetcher, &snapshot, email, time.Second*5, false)
}
