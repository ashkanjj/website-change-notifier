const AWS = require("aws-sdk");

const ddb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event, context) => {
  let responseMessage = "return all";

  // const requestBody = JSON.parse(event.body);
  return {
    statusCode: 200,
    message: responseMessage,
  };
};
