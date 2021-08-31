import axios from "axios";
import { DynamoDBResponse, User, WatchedUrlTable } from "../types";

function getURLs(user?: number) {
  return axios.get<DynamoDBResponse<WatchedUrlTable>>(
    `https://ovxhaf8vq3.execute-api.eu-west-2.amazonaws.com/watcher${
      user ? `/${user}` : ""
    }`
  );
}

function registerNewURL({ url }: { user: number; url: string }) {
  return axios.post(
    `https://25xyxzbcb7.execute-api.eu-west-2.amazonaws.com/watcher`,
    {
      key: "xuNPkEn+SutkciDSZfsmedU2GQ2t1WqfBIFBhtVD", // hardcoded key, remove after authenticate is done
      url,
    }
  );
}

export { getURLs, registerNewURL };
