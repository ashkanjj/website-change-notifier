import { faList, faDoorOpen } from "@fortawesome/free-solid-svg-icons";
import React, { useCallback, useContext, useState } from "react";
import ReactLoading from "react-loading";
import BurgerMenu from "./BurgerMenu";
import IconText, { IconTextProps } from "./components/IconText";
import useAPICall from "./hooks/fetch";
import { getURLs } from "./services/url-watcher";
import { DynamoDBResponse, User, WatchedUrlTable } from "./types";
import { UserContext } from "./UserProvider";

const menuWidth = {
  smDevices: 16,
  mdDevices: 56,
};

function App() {
  return (
    <div className="wrapper grid grid-rows-layout grid-flow-col h-screen z-index: 0;    ">
      <Header />
      <SideMenu />
      <Content />
    </div>
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
      <div>WebsiteChangeNotifier</div>
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
    open ? menuWidth.mdDevices : menuWidth.smDevices
  } md:w-${menuWidth.mdDevices}`; // by default small devices width OR medium devices if moused over AND medium devices width when on medium width
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

function URLListContainer({ items }: { items: WatchedUrlTable[] }) {
  return (
    <div>
      <p>Registered URLs</p>
      {items.map((item) => (
        <div key={item.sk}>{item.sk}</div>
      ))}
    </div>
  );
}

function CreateNewURLCTA() {
  return (
    <div>
      <p>You have no registered URLs!</p>
      <button>Create new URL</button>
    </div>
  );
}

function Content() {
  const user = useContext(UserContext);
  const getUserURLs = useCallback(() => getURLs(3), [getURLs]);
  const { response, error, loading } =
    useAPICall<DynamoDBResponse<WatchedUrlTable>>(getUserURLs);

  const items = response?.data?.Items || [];

  const userHasURLs = items.length > 0;

  return (
    <div
      className={`col-start-1 col-span-2 row-start-2 row-span-1 z-10 p-4 ml-${menuWidth.smDevices} md:ml-${menuWidth.mdDevices} transition-all duration-300`}
    >
      <h1 className="text-2xl">Welcome {user?.name}</h1>
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
            {userHasURLs ? (
              <>{items.length && <URLListContainer items={items} />}</>
            ) : (
              <CreateNewURLCTA />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
