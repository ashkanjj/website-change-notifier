import React from "react";
import ReactDOM from "react-dom";
import "tailwindcss/tailwind.css";
import App from "./App";
import UserProvider from "./UserProvider";

ReactDOM.render(
  <UserProvider>
    <App />
  </UserProvider>,
  document.getElementById("root")
);
