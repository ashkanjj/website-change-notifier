package main

import (
	"encoding/json"
	"flag"
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
	http.HandleFunc("/api/websites", getWebsitesHandler(snapshotFolder))
	http.Handle("/static/", http.StripPrefix("/static/", fileServer))
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "./static/index.html")
	})
	log.Println("Listening on :8080...")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func getWebsitesHandler(snapshotFolder *string) func(http.ResponseWriter, *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		websites, err := getWebsites(*snapshotFolder)

		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}

		websitesJSON, err := json.Marshal(websites)

		if err != nil {
			http.Error(w, err.Error(), http.StatusBadGateway)
		}

		w.Write(websitesJSON)
	}
}

type Website struct {
	Name string `json:"name"`
}

func getWebsites(folder string) ([]Website, error) {

	if _, err := os.Stat(folder); err != nil {
		return nil, err
	}

	fileInfoDirectories, err := ioutil.ReadDir(folder)
	if err != nil {
		return nil, err
	}

	var directories []Website

	for _, f := range fileInfoDirectories {
		
		directories = append(directories, Website{Name: f.Name()})
	}

	return directories, nil
}

func panicIfError(err error) {
	if err != nil {
		panic(err)
	}
}
