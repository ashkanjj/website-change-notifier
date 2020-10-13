package main

import (
	"flag"
	"log"
	"time"

	wcn "github.com/ashkanjj/go-websiteChangeNotifier"
	"github.com/ashkanjj/go-websiteChangeNotifier/db"
)

var (
	url             = flag.String("url", "", "URL to load")
	emailConfigFile = flag.String("config", "", "Config file")
)

func main() {

	flag.Parse()

	if *url == "" {
		log.Fatal("Need the url")
	}

	if *emailConfigFile == "" {
		log.Fatal("Need the config file")
	}

	db, err := db.NewDB()
	if err != nil {
		log.Fatal("error connecting to the db", err)
	}
	defer db.Close()
	website, err := wcn.NewWebsite(*url, db)

	if err != nil {
		log.Fatal("error saving the website to db", err)
	}

	// Initially fetch the website content
	htmlBody, err := website.Fetch()

	if err != nil {
		log.Fatal("error in fetching the website", err)
	}

	snapshot := wcn.NewSnapshot(website.ID, db)

	if saveError := snapshot.Save(htmlBody); saveError != nil { //save the body of what was returned
		log.Fatal("Error initially saving the content", saveError.Error())
	}

	// Load email configuration
	emailConfig := wcn.EmailConfig(*emailConfigFile)

	email, emailSetupError := wcn.NewEmailService(&emailConfig)

	if emailSetupError != nil {
		log.Fatal("Email setup error", emailSetupError)
	}

	wcn.Process(website, snapshot, email, time.Second*5, false)
}
