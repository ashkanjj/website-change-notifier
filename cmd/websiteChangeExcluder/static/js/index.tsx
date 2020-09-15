import "normalize.css";
import "@fortawesome/fontawesome-free/js/all.js";
import "@fortawesome/fontawesome-free/css/all.css";

import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ReactDOM from "react-dom";
import styled, { createGlobalStyle, ThemeProvider } from "styled-components";
import theme from "./theme";
import Home from "./pages/Home/Home";
import Menu from "./components/Menu";

const GlobalStyle = createGlobalStyle`
body {
  background-color: ${(props) => props.theme.bg}
}
`;

const Container = styled.div`
  padding-top: ${(props) => props.theme.spacing["5"]};
  max-width: 800px;
  width: 100%;
  margin: 0px auto;
`;

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Container>
        <Menu />
        <Router>
          <Switch>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </Router>
      </Container>
    </ThemeProvider>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
