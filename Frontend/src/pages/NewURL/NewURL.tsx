import React from "react";
import {
  Route,
  RouteComponentProps,
  Switch,
  useRouteMatch,
} from "react-router-dom";
import NewURLForm from "./NewURLForm";
import NewURLSuccess from "./NewURLSuccess";

export default function NewURLIndex(props: RouteComponentProps) {
  let { path, url } = useRouteMatch();
  setTimeout(() => {
    console.log("all good");
  }, 4000);
  return (
    <Switch>
      <Route path={`${path}/success`}>
        <NewURLSuccess />
      </Route>
      <Route exact path={path} component={NewURLForm} />
    </Switch>
  );
}
