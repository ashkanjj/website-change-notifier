import React, { useCallback, useContext } from "react";

import config from "../../config";
import useAPICall from "../../hooks/fetch";
import { getURLs } from "../../services/url-watcher";
import { DynamoDBResponse, WatchedUrlDynamoTable } from "../../types";
import { UserContext } from "../../UserProvider";
import CreateNewURLCTA from "./CreateNewCTA";
import URLList from "./URLList";

function Home() {
  const user = useContext(UserContext);
  const getUserURLs = useCallback(() => getURLs(4), [getURLs]);

  const { response, originalResponse, error, loading } =
    useAPICall<DynamoDBResponse<WatchedUrlDynamoTable>>(getUserURLs);

  const shouldShowCreateNewURLCTA =
    !loading && !error && response?.data?.Items.length === 0;

  return (
    <div
      style={{ backgroundColor: "#f7f8fa" }}
      className={`col-start-1 col-span-2 row-start-2 row-span-1 z-10 p-4 ml-${config.menuWidth.smDevices} md:ml-${config.menuWidth.mdDevices} transition-all duration-300 overflow-auto`}
    >
      <h1 className="text-2xl mb-6">Welcome {user?.name}</h1>

      {shouldShowCreateNewURLCTA ? (
        <CreateNewURLCTA />
      ) : (
        <URLList
          originalResponse={originalResponse}
          response={response}
          error={error}
          loading={loading}
        />
      )}
    </div>
  );
}

export default Home;
