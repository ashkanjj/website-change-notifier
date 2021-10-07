import axios from "axios";
import { DynamoDBResponse, User, WatchedUrlDynamoTable } from "../types";
import { transformDynamoToWatchedURL } from "../utils/watched-url";

async function getURLs(user?: number) {
  const results = await axios.get<DynamoDBResponse<WatchedUrlDynamoTable>>(
    `https://ovxhaf8vq3.execute-api.eu-west-2.amazonaws.com/watcher${
      user ? `/${user}` : ""
    }`
  );
  return transformDynamoToWatchedURL(results);
}

function registerNewURL({ url }: { url: string }) {
  return axios.post(
    `https://25xyxzbcb7.execute-api.eu-west-2.amazonaws.com/watcher`,
    {
      key: "xuNPkEn+SutkciDSZfsmedU2GQ2t1WqfBIFBhtVD", // hardcoded key, remove after authenticate is done
      url,
    }
  );
}

export { getURLs, registerNewURL };
