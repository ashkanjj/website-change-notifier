import "normalize.css";
import "@fortawesome/fontawesome-free/js/all.js";
import "@fortawesome/fontawesome-free/css/all.css";

import {
  Box,
  extendTheme,
  Grid,
  GridItem,
  Link,
  List,
  ListItem,
  Text,
} from "@chakra-ui/react";
import WebsiteSnapshots from "./pages/Snapshots/WebsiteSnapshots";
import Exclusions from "./pages/Exclusions";

import React from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link as RouterLink,
} from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Main from "./components/Main";

const theme = extendTheme({
  colors: {
    brand: {
      900: "#011A27",
      800: "#063852",
      700: "#F0810F",
      600: "#E6DF344",
    },
  },
  sizes: {
    sm: {
      marginBottom: 5,
    },
  },
  layerStyles: {
    base: {
      bg: "white",
      color: "black",
    },
    box: {
      py: "1",
      px: "2",
    },
  },
});

const App = () => {
  return (
    <Router>
      <ChakraProvider theme={theme}>
        <Grid
          h="100%"
          maxH="100%"
          templateColumns="20% 80%"
          templateRows="8% 1fr"
        >
          <GridItem rowSpan={1} colSpan={2} background="blue.700" color="white">
            <Header />
          </GridItem>
          <GridItem
            bg="gray.300"
            color="gray.700"
            colSpan={1}
            rowSpan={2}
            layerStyle="box"
          >
            <Sidebar />
          </GridItem>
          <GridItem layerStyle="base" colSpan={1} rowSpan={2}>
            <Main />
          </GridItem>
        </Grid>
      </ChakraProvider>
    </Router>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
