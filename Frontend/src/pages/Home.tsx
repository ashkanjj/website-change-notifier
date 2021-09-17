import React, { useCallback, useContext } from "react";
import ReactLoading from "react-loading";
import Card from "../components/Card";
import VStack from "../components/VStack";
import config from "../config";
import useAPICall from "../hooks/fetch";
import { getURLs } from "../services/url-watcher";
import { DynamoDBResponse, WatchedUrlDynamoTable } from "../types";
import { UserContext } from "../UserProvider";
import { transformDynamoToWatchedURL } from "../utils/watched-url";

function Home() {
  const user = useContext(UserContext);
  const getUserURLs = useCallback(() => getURLs(3), [getURLs]);

  const { response, error, loading } =
    useAPICall<DynamoDBResponse<WatchedUrlDynamoTable>>(getUserURLs);

  let transformedResponse;

  if (response?.data?.Items) {
    transformedResponse = transformDynamoToWatchedURL(response);
  }

  return (
    <div
      style={{ backgroundColor: "#f7f8fa" }}
      className={`col-start-1 col-span-2 row-start-2 row-span-1 z-10 p-4 ml-${config.menuWidth.smDevices} md:ml-${config.menuWidth.mdDevices} transition-all duration-300 overflow-auto`}
    >
      <h1 className="text-2xl">Welcome {user?.name}</h1>
      <div className="mt-4">
        {loading ? (
          <ReactLoading
            type={"spin"}
            color="#1e3a8a"
            height="50px"
            width="50px"
          />
        ) : error ? (
          <p>{error}</p>
        ) : (
          <>
            <h3 className="mb-4">
              Below you can find a list of your watched URLs
            </h3>

            <VStack spacing="24px">
              {transformedResponse?.map((d) => (
                <Card
                  key={d.sk}
                  url={d.url}
                  timestamp={
                    d.createdOn && new Date(d.createdOn).toLocaleString("en-gb")
                  }
                />
              ))}
            </VStack>
          </>
        )}
      </div>
    </div>
  );
}

function URLListContainer({ items }: { items: WatchedUrlDynamoTable[] }) {
  return (
    <div>
      <p>Registered URLs</p>
      {items.map((item) => (
        <div key={item.sk}>{item.sk}</div>
      ))}
    </div>
  );
}

function CreateNewURLCTA() {
  return (
    <div>
      <p>You have no registered URLs!</p>
      <button>Create new URL</button>
    </div>
  );
}

export default Home;
