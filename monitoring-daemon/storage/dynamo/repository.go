package dynamo

import (
	"errors"
	"fmt"
	"strings"

	"github.com/ashkanjj/website-change-notifier/monitoring-daemon/core"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
)

type Storage struct {
	client *dynamodb.DynamoDB
}

func (s Storage) CreateSnapshotForURL(userId int, url string, body string) error {
	_, err := s.client.PutItem(&dynamodb.PutItemInput{
		TableName: aws.String("watched-url"),
		Item: map[string]*dynamodb.AttributeValue{
			"sk": {
				S: aws.String(fmt.Sprintf("SNAPSHOT#%v#", url)),
			},
			"userId": {
				N: aws.String(fmt.Sprint(userId)),
			},
			"content": {
				S: aws.String(body),
			},
		},
	})

	if err != nil {
		return err
	}

	return nil
}

func (s Storage) GetAllURLs() ([]core.URL, error) {

	results, err := s.client.Query(&dynamodb.QueryInput{
		IndexName:              aws.String("GetAllIndex"),
		TableName:              aws.String("watched-url"),
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

	if err != nil {
		errors.New(fmt.Sprintf("failedto retrieve URLs, %v", err))
	}

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
		return nil, errors.New(fmt.Sprintf("failed to unmarshal Dynamodb URL query Items, %v", err))
	}

	s.cleanURLs(recs)

	return recs, err

}

func (s Storage) GetAllSnapshotsForURL(url string, userId int) ([]core.Snapshot, error) {
	results, err := s.client.Query(&dynamodb.QueryInput{
		TableName:              aws.String("watched-url"),
		KeyConditionExpression: aws.String("userId = :userId and begins_with(sk, :sk)"),
		ExpressionAttributeValues: map[string]*dynamodb.AttributeValue{
			":sk": {
				S: aws.String(fmt.Sprintf("SNAPSHOT#%v#", url)),
			},
			":userId": {
				N: aws.String(fmt.Sprint(userId)),
			},
		},
	})

	if err != nil {
		errors.New(fmt.Sprintf("failed to retrieve snapshots, %v", err))
	}

	recs := []core.Snapshot{}

	unmarshallError := dynamodbattribute.UnmarshalListOfMaps(results.Items, &recs)

	if unmarshallError != nil {
		return nil, errors.New(fmt.Sprintf("failed to unmarshal Dynamodb snapshots query Items, %v", err))
	}

	return recs, nil
}

func (s Storage) cleanURLs(recs []core.URL) {
	for i := range recs {
		recs[i].Sk = strings.Replace(recs[i].Sk, "URL#", "", -1)
	}

}

// getAllURLs

// createSnapsnot

func NewStorage(session *session.Session) (*Storage, error) {

	dynamoClient := dynamodb.New(session)

	return &Storage{client: dynamoClient}, nil
}
