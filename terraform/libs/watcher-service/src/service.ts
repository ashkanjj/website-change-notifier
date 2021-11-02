import * as AWS from "aws-sdk";

const ddb = new AWS.DynamoDB.DocumentClient();

export function getURLs(user?: number) {
  const query = user
    ? ddb
        .query({
          TableName: "watched-url",
          KeyConditionExpression: "userId = :hkey",
          ExpressionAttributeValues: {
            ":hkey": user,
          },
        })
        .promise()
    : ddb
        .scan({
          TableName: "watched-url",
        })
        .promise();
  return query;
}

export function registerURL(userId: number, url: string, createdOn: string) {
  return ddb
    .put({
      TableName: "watched-url",
      Item: {
        userId,
        sk: "URL#" + url,
        createdOn,
      },
    })
    .promise();
}
