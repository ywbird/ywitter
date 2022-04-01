import React from "react";
import * as ReactDOMClient from "react-dom/client";
import App from "components/App";
import firebase from "fbase";
console.log(firebase);

const container = document.getElementById("root");

const root = ReactDOMClient.createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
