import { getURL, registerURL } from "@ashkanjj/watcher-service";
import { APIGatewayProxyEvent } from "aws-lambda";
import * as AWS from "aws-sdk";

const ddb = new AWS.DynamoDB.DocumentClient();

export const handler = async (event: APIGatewayProxyEvent) => {
  console.log("Event: ", event);
  let responseMessage = "URL successfully registered";

  const requestBody: { key: string; url: string } = JSON.parse(event.body);

  const userId = 3; // hardcoded for now

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

  const matchingURL = await getURL(userId, requestBody.url);

  if (matchingURL.Items && matchingURL.Items.length) {
    // URL already exists
    return {
      error: "URL is already registered ",
      statusCode: 409,
    };
  }

  const currentDate = new Date().toISOString();

  return new Promise((res, rej) => {
    registerURL(3, requestBody.url, currentDate)
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
