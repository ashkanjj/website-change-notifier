import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import config from "./config";
import { Header } from "./Header";
import Home from "./pages/Home/Home";
import NewURL from "./pages/NewURL/NewURL";
import { SideMenu } from "./SideMenu";

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
            <Route path="/new-url-watcher" component={NewURL} />
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
