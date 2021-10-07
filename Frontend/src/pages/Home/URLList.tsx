import React from "react";
import ReactLoading from "react-loading";
import Card from "../../components/Card";
import VStack from "../../components/VStack";
import { WatchedUrl } from "../../types";

export default (props: { data: WatchedUrl[] | undefined }) => {
  const { data } = props;

  return (
    <div className="mt-4">
      <h3 className="mb-4">Below you can find a list of your watched URLs</h3>

      <VStack spacing="24px">
        {data &&
          data?.map((d) => (
            <Card
              key={d.sk}
              url={d.url}
              timestamp={
                d.createdOn && new Date(d.createdOn).toLocaleString("en-gb")
              }
            />
          ))}
      </VStack>
    </div>
  );
};
