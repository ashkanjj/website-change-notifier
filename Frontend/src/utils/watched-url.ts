import { AxiosResponse } from "axios";
import { DynamoDBResponse, WatchedUrl, WatchedUrlDynamoTable } from "../types";

export function transformDynamoToWatchedURL(
  res: AxiosResponse<DynamoDBResponse<WatchedUrlDynamoTable>>
): WatchedUrl[] {
  const watchedURLs: WatchedUrl[] = [];
  let items = res?.data?.Items || [];
  items.forEach((item, i) => {
    const watchedURL: WatchedUrl = {
      sk: "",
      userId: 0,
      url: "",
      createdOn: "",
    };
    watchedURL.createdOn = item.createdOn;
    watchedURL.sk = item.sk;
    watchedURL.userId = item.userId;
    if (item.sk.startsWith("URL#")) {
      watchedURL.url = item.sk.replace("URL#", "");
    }
    watchedURLs.push(watchedURL);
  });
  console.log("watchedURLs", watchedURLs);
  return watchedURLs;
}
