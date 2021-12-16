package dynamo

import (
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
)

type Storage struct {
}

func NewStorage() (*Storage, error) {

	sess, err := session.NewSession(&aws.Config{
		Region: aws.String("eu-west-2")},
	)

	if err != nil	 {
		return nil, err
	}

	println("AWS session created", sess)

	return &Storage{}, nil
}