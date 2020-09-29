package main

import (
	"flag"
	"log"
	"time"

	wcn "github.com/ashkanjj/go-websiteChangeNotifier"
	bolt "go.etcd.io/bbolt"
)

var (
	url             = flag.String("url", "", "URL to load")
	emailConfigFile = flag.String("config", "", "Config file")
)

func main() {

	var db *bolt.DB

	flag.Parse()

	if *url == "" {
		log.Fatal("Need the url")
	}

	if *emailConfigFile == "" {
		log.Fatal("Need the config file")
	}

	db, err := bolt.Open("my.db", 0600, nil)
	if err != nil {
		log.Fatal("error connecting to the db", err)
	}
	defer db.Close()
	website, err := wcn.NewWebsite(*url, db)

	if err != nil {
		log.Fatal("error saving the website to db", err)
	}

	// db.View(func(tx *bolt.Tx) error {
	// 	b := tx.Bucket([]byte("Website"))
	// 	c := b.Cursor()

	// 	for k, v := c.First(); k != nil; k, v = c.Next() {
	// 		fmt.Printf("key=%s, value=%s\n", k, v)
	// 	}
	// 	return nil
	// })
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

	wcn.Process(&website, &snapshot, email, time.Second*5, false)
}
