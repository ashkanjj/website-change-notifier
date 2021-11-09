import { ddb } from './dynamo-client';

export function getURLs(user?: number) {
  const query = user
    ? ddb
        .query({
          TableName: 'watched-url',
          KeyConditionExpression: 'userId = :hkey',
          ExpressionAttributeValues: {
            ':hkey': user,
          },
        })
        .promise()
    : ddb
        .scan({
          TableName: 'watched-url',
        })
        .promise();
  return query;
}

export function getURL(userId: number, url: string) {
  const query = ddb
    .query({
      TableName: 'watched-url',
      KeyConditionExpression: 'userId = :hkey AND sk = :url',
      ExpressionAttributeValues: {
        ':hkey': userId,
        ':url': `URL#${url}`,
      },
    })
    .promise();

  return query;
}

export function registerURL(userId: number, url: string, createdOn: string) {
  return ddb
    .put({
      TableName: 'watched-url',
      Item: {
        userId,
        sk: 'URL#' + url,
        createdOn,
      },
    })
    .promise();
}
