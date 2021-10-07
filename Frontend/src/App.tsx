import { faList, faDoorOpen } from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import BurgerMenu from "./BurgerMenu";
import IconText, { IconTextProps } from "./components/IconText";
import config from "./config";
import Home from "./pages/Home/Home";
import NewURL from "./pages/NewURL/NewURL";

function App() {
  return (
    <Router>
      <div className="wrapper grid grid-rows-layout grid-flow-col h-screen z-index: 0;    ">
        <Header />
        <SideMenu />
        <div
          style={{ backgroundColor: "#f7f8fa" }}
          className={`col-start-1 col-span-2 row-start-2 row-span-1 z-10 p-4 ml-${config.menuWidth.smDevices} md:ml-${config.menuWidth.mdDevices} transition-all duration-300 overflow-auto`}
        >
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route exact path="/new-url-watcher">
              <NewURL />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

function SideMenuIconText(props: {
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

function Header() {
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

function SideMenu() {
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
          <SideMenuIconText
            text="Watched URLs"
            faIcon={faList}
            mousedOver={open}
          />
        </li>
      </ul>
    </div>
  );
}
export default App;
