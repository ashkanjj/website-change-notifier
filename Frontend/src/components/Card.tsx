import React from "react";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import IconText from "./IconText";

// What are we showing: URL, Desc (optional), timestamp

interface Card {
  url: string;
  desc?: string;
  timestamp?: string;
}

const Card = (props: Card) => {
  const { url, desc = "", timestamp } = props;
  return (
    <div
      className="relative rounded-t-sm text-black text-left  bg-white border border-geyser  hover:border-cornflower-blue hover:cursor-pointer"
      style={{ transition: "all .2s ease-in-out" }}
    >
      <div className="pt-6 px-3 pb-4 flex">
        <h4 className="mt-1 mx-0 mb-3">{url}</h4>
        <p className="text-sm" style={{ minHeight: "24px" }}>
          {desc}
        </p>
      </div>
      <div
        className="h-10 pt-0 pr-3 pb-0 flex justify-between line leading-10 font-bold "
        style={{
          borderTop: "1px solid #dce0e6",
          background: "#f7f8fa",
          fontSize: "0.8rem",
        }}
      >
        <span className="mr-6">
          <IconText
            textSize="xs"
            wrapperClassName="mr-4 text-gray-500"
            faIcon={faClock}
            text={timestamp || ""}
            textClassName="hidden md:block"
          />
        </span>
      </div>
    </div>
  );
};

export default Card;
