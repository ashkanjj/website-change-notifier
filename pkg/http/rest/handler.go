package rest

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/ashkanjj/go-websiteChangeNotifier/pkg/listing"
)

type Server struct {
}

func Handler(l *listing.Service) *http.ServeMux {
	static := "../../pkg/http/rest/static"
	fileServer := http.FileServer(http.Dir(static))

	mux := http.NewServeMux()

	mux.HandleFunc("/api/websites", getWebsites(l))
	mux.HandleFunc("/api/snapshots", getSnapshots(l))
	mux.Handle("/static/", http.StripPrefix("/static/", fileServer))
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		index := fmt.Sprintf("%s/index.html", static)
		http.ServeFile(w, r, index)
	})

	return mux
}


func getSnapshots(l *listing.Service) func(http.ResponseWriter, *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		// TODO: here
		query := r.URL.Query()
		websiteID := query.Get("websiteId")
		data, err := l.GetSnapshotsByWebsite(websiteID)

		if err != nil {
			http.Error(w, "Error getting snapshots", http.StatusInternalServerError)
		}
		json.NewEncoder(w).Encode(data)
	}
}


func getWebsites(l *listing.Service) func(http.ResponseWriter, *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		ws, err := l.GetWebsites()

		if err != nil {
			http.Error(w, "error from the service", http.StatusInternalServerError)
			return
		}

		json.NewEncoder(w).Encode(ws)
	}
}

