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
  return (
    <Switch>
      <Route path={`${path}/success`}>
        <NewURLSuccess />
      </Route>
      <Route exact path={path} component={NewURLForm} />
    </Switch>
  );
}
