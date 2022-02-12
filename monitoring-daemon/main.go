package main

import (
	"log"

	"github.com/ashkanjj/website-change-notifier/monitoring-daemon/monitoring"
	"github.com/ashkanjj/website-change-notifier/monitoring-daemon/storage/dynamo"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
)


type WatchedURL struct {
	userId int
	url string
	createdOn string
}

func main() {
	
	sess, err := session.NewSession(&aws.Config{
		Region: aws.String("eu-west-2"),
	})

	if err != nil {
    log.Fatalf("Got error creating session: %s", err)
	}

	s, err := dynamo.NewStorage(sess)
	
	if err != nil {
		println("error connecting to dynamodb")
	}

	monitoringService := monitoring.NewService(s)

	// for now chunk up the list of websites and spawn off goroutines with n number of websites 

	monitoringService.Process()
}

