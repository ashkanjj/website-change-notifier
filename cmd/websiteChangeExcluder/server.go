package main

import (
	"flag"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
)

// This should serve a SPA static server
// And also serve an API for accepting exclusion commands from the SPA

// input: a folder of snapshots
// output: different pages rendering React on the FE (or the BE if at all possible with Go) with APIs that enables the user to exclude certain chunks

// pages:
// List of all different websites
// website page which lists all of its snapshots and possibly a filter which allows the user to filter with dates

var (
	snapshotFolder = flag.String("snapshotFolder", "", "Snapshot folder")
)

func main() {
	flag.Parse()

	if *snapshotFolder == "" {
		panic("Need the snapshot folder")
	}

	fileServer := http.FileServer(http.Dir("./static"))
	http.Handle("/static/", http.StripPrefix("/static/", fileServer))
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "./static/index.html")
	})
	log.Println("Listening on :3000...")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func getWebsites(folder string) ([]string, error) {
	_, err := os.Stat(folder)

	if err != nil {
		return nil, err
	}

	fileInfoDirectories, err := ioutil.ReadDir(folder)
	if err != nil {
		return nil, err
	}

	var directories = make([]string, len(fileInfoDirectories))

	for _, f := range fileInfoDirectories {
		fmt.Println("f is: ", f.Name(), f.IsDir())
		directories = append(directories, f.Name())
	}

	return directories, nil
}

func panicIfError(err error) {
	if err != nil {
		panic(err)
	}
}
