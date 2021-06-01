import React from "react";
import { Switch, Route } from "react-router-dom";
import { Box, Grid, GridItem, Text } from "@chakra-ui/react";
import WebsiteSnapshots from "../pages/Snapshots/WebsiteSnapshots";
import Exclusions from "../pages/Exclusions";

const routes = [
  {
    path: "/exclusions",
    title: "Exclusions",
    component: Exclusions,
  },
  {
    path: "/",
    title: "List of Websites",
    component: WebsiteSnapshots,
  },
];

const Main = () => {
  return (
    <Grid templateColumns="100%" templateRows="12% 88%" h="100%">
      <GridItem
        borderBottom="2px solid"
        borderColor={"gray.400"}
        layerStyle="box"
      >
        <Switch>
          {routes.map((route) => (
            <Route
              key={route.path}
              exact={route.exact}
              path={route.path}
              render={() => (
                <Text fontSize="4xl" marginBottom={5}>
                  {route.title}
                </Text>
              )}
            />
          ))}
        </Switch>
      </GridItem>
      <GridItem>
        <Switch>
          {routes.map((route) => (
            <Route
              key={route.path}
              exact={route.exact}
              path={route.path}
              component={route.component}
            />
          ))}
        </Switch>
      </GridItem>
    </Grid>
  );
};

export default Main;
