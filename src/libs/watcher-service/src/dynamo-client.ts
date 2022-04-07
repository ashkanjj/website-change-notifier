import * as AWS from 'aws-sdk';

const isTest = process.env.MOCK_DYNAMODB_ENDPOINT;
const config = {
  ...(isTest && {
    endpoint: process.env.MOCK_DYNAMODB_ENDPOINT,
    sslEnabled: false,
    region: 'local',
  }),
};

export const ddb = new AWS.DynamoDB.DocumentClient(config);
