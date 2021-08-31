const AWS = require("aws-sdk");

const ddb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event, context) => {
  const user = event.pathParameters && event.pathParameters.user;
  console.log("get user", user, event.pathParameters);
  if (user) {
    console.log("which one 1");
    return new Promise((res, rej) => {
      getURLs(+user).then((results) => {
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
    console.log("which one 2");
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
