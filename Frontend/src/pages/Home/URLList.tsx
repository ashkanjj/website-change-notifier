import React from "react";
import ReactLoading from "react-loading";
import Card from "../../components/Card";
import VStack from "../../components/VStack";
import { UseAPICallResponse } from "../../hooks/fetch";
import { DynamoDBResponse, WatchedUrlDynamoTable } from "../../types";
import { transformDynamoToWatchedURL } from "../../utils/watched-url";

export default (
  props: UseAPICallResponse<DynamoDBResponse<WatchedUrlDynamoTable>>
) => {
  const { error, loading, response } = props;

  let transformedResponse;

  if (response?.data?.Items) {
    transformedResponse = transformDynamoToWatchedURL(response);
  }
  return (
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
  );
};
