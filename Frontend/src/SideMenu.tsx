import { faList } from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import BurgerMenu from "./BurgerMenu";
import IconText, { IconTextProps } from "./components/IconText";
import config from "./config";

export function SideMenuIconText(props: {
  mousedOver?: boolean;
  faIcon?: IconTextProps["faIcon"];
  text: string;
}) {
  const { faIcon, mousedOver = false } = props;
  return (
    <IconText
      text="Watched URLs"
      faIcon={faIcon}
      wrapperClassName="focus:outline-none hover:bg-blue-800 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 dark:hover:border-gray-800"
      textClassName={`${mousedOver ? "block" : "hidden"} md:block`}
    />
  );
}

export function SideMenu() {
  const [open, setOpen] = useState(false);
  const wrapperWidth = `w-${
    open ? config.menuWidth.mdDevices : config.menuWidth.smDevices
  } md:w-${config.menuWidth.mdDevices}`; // by default small devices width OR medium devices if moused over AND medium devices width when on medium width
  return (
    <div
      className={`fixed ${wrapperWidth} z-20 bg-blue-900 h-full transition-all duration-300 pt-14`}
    >
      <BurgerMenu className={`block md:hidden`} onOpen={setOpen} open={open} />
      <ul
        className={`${
          open ? "block" : "hidden"
        } md:block overflow-y-auto overflow-x-hidden flex flex-col justify-between flex-grow text-white transition-all duration-300`}
      >
        <li className="px-5">
          <div
            className={`text-sm font-light tracking-wide text-gray-400 uppercase`}
          >
            Main
          </div>
        </li>
        <li className="pt-1">
          <Link to="/">
            <SideMenuIconText
              text="Watched URLs"
              faIcon={faList}
              mousedOver={open}
            />
          </Link>
        </li>
      </ul>
    </div>
  );
}
