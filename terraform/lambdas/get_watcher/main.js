const AWS = require("aws-sdk");

const ddb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event, context) => {
  const user = event.pathParameters && event.pathParameters.user;

  if (user) {
    return new Promise((res, rej) => {
      getURLs(user).then((results) => {
        console.log("any results", results);
        res({
          statusCode: 200,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(results),
        });
      });
    });
  } else {
    return new Promise((res, rej) => {
      getURLs().then((results) => {
        console.log("all results", results);
        res({
          statusCode: 200,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(results),
        });
      });
    });
  }
};

function getURLs(user) {
  return user
    ? ddb.query({
        TableName: "watched-url",
        KeyConditionExpression: "userId = :hkey",
        ExpressionAttributeValues: {
          ":hkey": user,
        },
      })
    : ddb
        .scan({
          TableName: "watched-url",
        })
        .promise();
}
