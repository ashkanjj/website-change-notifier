package main

import (
	"flag"
	"log"
	"net/http"

	"github.com/ashkanjj/go-websiteChangeNotifier/pkg/http/rest"
	"github.com/ashkanjj/go-websiteChangeNotifier/pkg/listing"
	"github.com/ashkanjj/go-websiteChangeNotifier/pkg/storage/bolt"
)

var (
	dbpath = flag.String("dbpath", "", "Bolt db path")
)

func main() {
	flag.Parse()

	storage, err := bolt.NewStorage(*dbpath)

	if *dbpath == "" {
		log.Fatal("need the db path")
	}

	defer storage.Close()

	if err != nil {
		log.Fatal("error connecting to storage", err)
	}

	lister := listing.NewService(storage)

	handler := rest.Handler(lister)
	log.Fatal(http.ListenAndServe(":8000", handler))

}
