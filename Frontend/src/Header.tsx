import { faDoorOpen } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { Link } from "react-router-dom";
import IconText from "./components/IconText";

export function Header() {
  return (
    <div className="col-start-1 col-span-2 row-start-1 row-span-1 flex flex-row items-center justify-between z-30 pl-5 bg-blue-800 text-white">
      <div>
        <Link to="/">WebsiteChangeNotifier</Link>
      </div>
      <IconText
        wrapperClassName="mr-4 hover:text-blue-100"
        faIcon={faDoorOpen}
        text="Logout"
        textClassName="hidden md:block"
      />
    </div>
  );
}
