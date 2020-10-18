import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { combineReducers, configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import logger from "redux-logger";

import App from "./App";
import * as serviceWorker from "./serviceWorker";
import annotatorReducer from "./modules/annotator";

const rootReducer = combineReducers({
  annotatorReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware().concat(logger),
});

export type RootState = ReturnType<typeof rootReducer>;

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root"),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
