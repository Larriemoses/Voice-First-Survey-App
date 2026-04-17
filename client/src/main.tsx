import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");

function applyTheme(modeIsDark: boolean) {
  document.documentElement.classList.toggle("dark", modeIsDark);
}

applyTheme(darkModeQuery.matches);
darkModeQuery.addEventListener("change", (event) => {
  applyTheme(event.matches);
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
