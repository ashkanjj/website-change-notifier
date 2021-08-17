const AWS = require("aws-sdk");

const ddb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event, context) => {
  console.log("Event: ", event);
  let responseMessage = "URL successfully registered";

  const requestBody = JSON.parse(event.body);

  if (requestBody.key !== "xuNPkEn+SutkciDSZfsmedU2GQ2t1WqfBIFBhtVD") {
    return {
      statusCode: 401,
    };
  }

  if (!requestBody.url) {
    return {
      error: "URL is missing from request",
      statusCode: 400,
    };
  }

  return new Promise((res, rej) => {
    registerURL(3, requestBody.url)
      .then(() => {
        res({
          statusCode: 200,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: responseMessage,
          }),
        });
      })
      .catch((err) => {
        console.error(err);
        rej({
          statusCode: 500,
        });
      });
  });
};

function registerURL(userId, url) {
  return ddb
    .put({
      TableName: "watched-url",
      Item: {
        userId,
        sk: "URL#" + url,
      },
    })
    .promise();
}
