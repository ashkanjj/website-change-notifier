import { getURL, getURLs, registerURL } from '.';
import { ddb } from './dynamo-client';

describe('service', () => {
  beforeAll(() => {
    jest.setTimeout(10000);
  });
  const userId = 141;
  describe('getURLs', () => {
    beforeAll(async () => {
      await ddb
        .put({
          TableName: 'watched-url',
          Item: {
            userId,
            sk: 'URL#http://google.com',
          },
        })
        .promise();
      await ddb
        .put({
          TableName: 'watched-url',
          Item: {
            userId,
            sk: 'URL#http://hotmail.com',
          },
        })
        .promise();
    });
    it('it should return the list of URLs', async () => {
      const results = await getURLs(userId);

      expect(results.Items?.length).toEqual(2);
      expect(results.Items).toMatchSnapshot();
    });
  });

  describe('getURL', () => {
    const userId = 111;
    beforeAll(async () => {
      await ddb
        .put({
          TableName: 'watched-url',
          Item: {
            userId,
            sk: 'URL#http://google.com',
          },
        })
        .promise();
      await ddb
        .put({
          TableName: 'watched-url',
          Item: {
            userId,
            sk: 'URL#http://hotmail.com',
          },
        })
        .promise();
    });

    it('should return the result matching the URL', async () => {
      const result = await getURL(userId, 'http://hotmail.com');
      expect(result.Items?.length).toEqual(1);
      expect(result.Items && result.Items[0]).toEqual({
        userId: 111,
        sk: 'URL#http://hotmail.com',
      });
    });
  });

  describe('registerURL', () => {
    it('should add a new item', async () => {
      const url = 'http://hotmail.com';
      const userId = 14131;
      const createdDate = '2021-10-16T14:35:57.576Z';
      await registerURL(14131, url, createdDate);

      const result = await ddb
        .query({
          TableName: 'watched-url',
          KeyConditionExpression: 'userId = :hkey AND sk = :url',
          ExpressionAttributeValues: {
            ':hkey': userId,
            ':url': `URL#${url}`,
          },
        })
        .promise();

      expect(result.Items?.length).toEqual(1);
      expect(result.Items && result.Items[0]).toEqual({
        userId: 14131,
        sk: 'URL#http://hotmail.com',
        createdOn: '2021-10-16T14:35:57.576Z',
      });
    });
  });
});
