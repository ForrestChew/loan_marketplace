import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { MetaMaskProvider } from "metamask-react";
import HamburgerContextProvider from "./contexts/HamburgerContextProvider";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <MetaMaskProvider>
    <BrowserRouter>
      <HamburgerContextProvider>
        <App />
      </HamburgerContextProvider>
    </BrowserRouter>
  </MetaMaskProvider>
);
