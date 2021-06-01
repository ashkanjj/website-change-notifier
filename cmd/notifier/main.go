package main

import (
	"flag"
	"log"
	"time"

	"github.com/ashkanjj/go-websiteChangeNotifier/pkg/adding"
	"github.com/ashkanjj/go-websiteChangeNotifier/pkg/cli"
	"github.com/ashkanjj/go-websiteChangeNotifier/pkg/email"
	"github.com/ashkanjj/go-websiteChangeNotifier/pkg/listing"
	"github.com/ashkanjj/go-websiteChangeNotifier/pkg/storage/bolt"
)

var (
	url             = flag.String("url", "", "URL to load")
	emailConfigFile = flag.String("config", "", "Config file")
	dbpath          = flag.String("dbpath", "", "Bolt db path")
)

func main() {
	flag.Parse()

	if *url == "" {
		log.Fatal("Need the url")
	}

	if *emailConfigFile == "" {
		log.Fatal("Need the config file")
	}


	storage, err := bolt.NewStorage(*dbpath)
	defer storage.Close()

	if err != nil {
		log.Fatal("error connecting to storage", err)
	}

	adder := adding.NewService(storage)
	lister := listing.NewService(storage)
	emailSender, err := email.NewService(*emailConfigFile)

	if err != nil {
		log.Fatal("error in email config", err)
	}
	cli.Process(adder, lister, emailSender, *url, time.Second*5, false)

}
