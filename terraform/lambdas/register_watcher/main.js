"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const watcher_service_1 = require("@ashkanjj/watcher-service");
const AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB.DocumentClient();
const handler = async (event) => {
    console.log("Event: ", event);
    let responseMessage = "URL successfully registered";
    const requestBody = JSON.parse(event.body);
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
    const matchingURL = await (0, watcher_service_1.getURL)(userId, requestBody.url);
    if (matchingURL.Items && matchingURL.Items.length) {
        // URL already exists
        return {
            error: "URL is already registered ",
            statusCode: 409,
        };
    }
    const currentDate = new Date().toISOString();
    return new Promise((res, rej) => {
        (0, watcher_service_1.registerURL)(3, requestBody.url, currentDate)
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
//# sourceMappingURL=main.js.map