package main

import (
	"github.com/ashkanjj/website-change-notifier/monitoring-daemon/monitoring"
	"github.com/ashkanjj/website-change-notifier/monitoring-daemon/storage/dynamo"
)


type WatchedURL struct {
	userId int
	url string
	createdOn string
}

func main() {
	// Get n number of websites and mark them as WATCHING
	// If there are more websites than this daemon can handle, fargate should spawn another daemon to handle them
	// We then need to somehow monitor when daemons go down

	// but for phase 1
	// get all the websites
	// take a snapshot of the initial 
	// websites := []WatchedURL{WatchedURL{userId: 3, url: "test", createdOn: ""}}
	// 

	r, err := dynamo.NewStorage()

	println("r is ", r)

	if err != nil {
		println("error connecting to dynamodb")
	}

	// TODO: next is pass the r to monitoring.NewService and get all the websites from dynamo (you'll need to add GetWebsites function to dynamo) 
	s := monitoring.NewService()


	s.Process()
}

