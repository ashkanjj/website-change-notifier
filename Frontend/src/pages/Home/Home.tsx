import React, { useContext } from "react";
import ReactLoading from "react-loading";
import useSWR from "swr";

import { getURLs } from "../../services/url-watcher";
import { UserContext } from "../../UserProvider";
import CreateNewURLCTA from "./CreateNewCTA";
import URLList from "./URLList";

function Home() {
  const user = useContext(UserContext);

  const { data, error } = useSWR("get_url", getURLs);

  const isLoading = !data && !error;
  const shouldShowCreateNewURLCTA = !isLoading && !error && data?.length === 0;

  if (isLoading) {
    return (
      <ReactLoading type={"spin"} color="#1e3a8a" height="50px" width="50px" />
    );
  } else if (error) {
    return <p>{error}</p>;
  } else {
    return (
      <>
        <h1 className="text-2xl mb-6">Welcome {user?.name}</h1>
        {shouldShowCreateNewURLCTA ? (
          <CreateNewURLCTA />
        ) : (
          <URLList data={data} />
        )}
        `
      </>
    );
  }
}

export default Home;
