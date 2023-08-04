import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/app";
import reportWebVitals from "./reportWebVitals";
import { AppContextProvider } from "./context/AppContextProvider";
import { BrowserRouter } from "react-router-dom";

import.meta.glob([
  './assets/images/**'
])

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
 
    <BrowserRouter>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </BrowserRouter>
 
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
