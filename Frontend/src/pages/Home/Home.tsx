import React, { useContext } from "react";
import ReactLoading from "react-loading";
import { Link } from "react-router-dom";
import useSWR from "swr";
import Button from "../../components/Button";

import { getURLs } from "../../services/url-watcher";
import { UserContext } from "../../UserProvider";
import URLList from "./URLList";

function Home() {
  const user = useContext(UserContext);

  const { data, error } = useSWR("3", getURLs);

  const isLoading = !data && !error;
  const shouldShowURLList = !isLoading && !error && !!data?.length;

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

        <div className="flex justify-between">
          <h3 className="mb-4">
            {shouldShowURLList ? (
              <>Below you can find a list of your watched URLs</>
            ) : (
              <>You have no registered URLs, you can create some &#128073;</>
            )}
          </h3>
          <Link to={"/new-url-watcher"} component={Button}>
            Add new URL
          </Link>
        </div>
        {shouldShowURLList && <URLList data={data} />}
      </>
    );
  }
}

export default Home;
