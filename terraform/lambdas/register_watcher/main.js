"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB.DocumentClient();
const handler = async (event) => {
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
exports.handler = handler;
function registerURL(userId, url, createdOn) {
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
//# sourceMappingURL=main.js.map