package dynamo

import (
	"errors"
	"fmt"

	"github.com/ashkanjj/website-change-notifier/monitoring-daemon/core"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
)

type Storage struct {
	client *dynamodb.DynamoDB
}

// Come up with a list of methods off of Storage type


func (s Storage) GetAllURLs() ([]core.URL, error)  {
	
	results, err := s.client.Query(&dynamodb.QueryInput{
		IndexName: aws.String("GetAllIndex"),
		TableName: aws.String("watched-url"),
		KeyConditionExpression: aws.String("#type = :type_val and begins_with(sk, :sk)"), // 
		ExpressionAttributeNames: map[string]*string{
			"#type": aws.String("type"),
		},
		ExpressionAttributeValues: map[string]*dynamodb.AttributeValue{
			":type_val": {
				S: aws.String("url"),
			},
			":sk": {
				S: aws.String("URL#"),
			},
		},
	})

	// result, err := s.client.GetItem(&dynamodb.GetItemInput{
	// 	TableName: aws.String(table),
		
	// 	Key: map[string]*dynamodb.AttributeValue{
	// 		"userId": {
	// 			N: aws.String("3"),
	// 		},
	// 		"sk": {
	// 			S: aws.String("URL#http://ash-2.com"),
	// 		},
	// 	},
	// })
	
	recs := []core.URL{}

	unmarshallError := dynamodbattribute.UnmarshalListOfMaps(results.Items, &recs)


	if unmarshallError != nil {
		return nil, errors.New(fmt.Sprintf("failed to unmarshal Dynamodb query Items, %v", err))
	}


	return recs, err

}

// getAllURLs

// createSnapsnot

func NewStorage(session *session.Session) (*Storage, error) {

	dynamoClient := dynamodb.New(session)

	return &Storage{client: dynamoClient}, nil
}