import React from "react";
import IconText from "./components/IconText";

function App() {
  return (
    <div className="wrapper">
      <div className="header bg-blue-800 pl-5 text-white	items-center flex flex-row justify-between ">
        <div>WebsiteChangeNotifier</div>
        <IconText className="mr-4 hover:text-blue-100" text="Logout" />
      </div>
      <div className="menu bg-blue-900 h-full">
        <ul className="overflow-y-auto overflow-x-hidden flex flex-col justify-between flex-grow text-white">
          <li className="px-5">
            <div className="text-sm font-light tracking-wide text-gray-400 uppercase">
              Main
            </div>
          </li>
          <li>
            <SideMenuIconText text="Watched URLs" />
          </li>
        </ul>
      </div>
      <div className="content">content</div>
    </div>
  );
}

function SideMenuIconText(props: { text: string }) {
  return (
    <IconText
      text="Watched URLs"
      className="focus:outline-none hover:bg-blue-800 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 dark:hover:border-gray-800"
    />
  );
}

export default App;
