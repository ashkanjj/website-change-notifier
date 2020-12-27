package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"

	"github.com/ashkanjj/go-websiteChangeNotifier/pkg/http/rest"
	"github.com/ashkanjj/go-websiteChangeNotifier/pkg/listing"
	"github.com/ashkanjj/go-websiteChangeNotifier/pkg/storage/bolt"
)

var (
	dbpath = flag.String("dbpath", "", "Bolt db path")
	port = "8000"
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
	log.Print(fmt.Sprintf("Listening on %s", port))
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%s", port), handler))

}
