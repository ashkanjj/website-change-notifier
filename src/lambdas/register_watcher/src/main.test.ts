import { APIGatewayProxyEvent } from "aws-lambda";
import { mocked } from "ts-jest/utils";
import * as watcherService from "@ashkanjj/watcher-service";

import { handler } from "./main";

jest.mock("@ashkanjj/watcher-service");

const mockedWatcherService = mocked(watcherService);

describe("Main", () => {
  afterEach(() => {
    mockedWatcherService.registerURL.mockReset();
    mockedWatcherService.getURL.mockReset();
    mockedWatcherService.getURLs.mockReset();
  });
  it("should return 401 if key doesnt match", async () => {
    const mockEvent = {
      body: JSON.stringify({
        key: "wrong key",
        url: "",
      }),
    };
    const res = await handler(mockEvent as unknown as APIGatewayProxyEvent);

    expect(res).toEqual({
      statusCode: 401,
    });
  });

  it("should return an error if URL is missing from body`", async () => {
    const mockEvent = {
      body: JSON.stringify({
        key: "xuNPkEn+SutkciDSZfsmedU2GQ2t1WqfBIFBhtVD",
      }),
    };
    const res = await handler(mockEvent as unknown as APIGatewayProxyEvent);

    expect(res).toEqual({
      error: "URL is missing from request",
      statusCode: 400,
    });
  });

  it("should return an 409 if URL already exists", async () => {
    mockedWatcherService.getURL.mockResolvedValue({
      Items: [
        {
          url: "some-url",
        },
      ],
    } as unknown as any);
    const mockEvent = {
      body: JSON.stringify({
        key: "xuNPkEn+SutkciDSZfsmedU2GQ2t1WqfBIFBhtVD",
      }),
    };
    const res = await handler(mockEvent as unknown as APIGatewayProxyEvent);
    console.log("res", res);
    expect(res).toEqual({
      error: "URL is missing from request",
      statusCode: 400,
    });
  });

  it("should return an error if registerURL returns an error", async () => {
    mockedWatcherService.getURL.mockResolvedValue({
      Items: [],
    } as unknown as any);
    mockedWatcherService.registerURL.mockImplementation(() =>
      Promise.reject("reject this")
    );
    const mockEvent = {
      body: JSON.stringify({
        key: "xuNPkEn+SutkciDSZfsmedU2GQ2t1WqfBIFBhtVD",
        url: "http://google.com",
      }),
    };
    try {
      await handler(mockEvent as unknown as APIGatewayProxyEvent);
    } catch (e) {
      expect(e.statusCode).toEqual(500);
    }
  });

  it("should return a successful response", async () => {
    mockedWatcherService.getURL.mockResolvedValue({
      Items: [],
    } as unknown as any);
    mockedWatcherService.registerURL.mockResolvedValue(true as unknown as any);
    const mockEvent = {
      body: JSON.stringify({
        key: "xuNPkEn+SutkciDSZfsmedU2GQ2t1WqfBIFBhtVD",
        url: "http://google.com",
      }),
    };
    const res = await handler(mockEvent as unknown as APIGatewayProxyEvent);
    expect(res).toEqual({
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: '{"message":"URL successfully registered"}',
    });
  });
});
