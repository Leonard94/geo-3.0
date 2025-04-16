import React from "react";
import ReactDOM from "react-dom";
import { App } from "./components/App/App";
import "./styles/index.scss";
import { ThemeProvider } from "@mui/material";
import theme from "./styles/theme";
import { HashRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/index";
import { initDB } from "./db/config";
import dayjs from "dayjs";
import "dayjs/locale/ru";

dayjs.locale("ru");

initDB().catch(console.error);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <HashRouter>
          <App />
        </HashRouter>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
