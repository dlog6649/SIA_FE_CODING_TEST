import React from "react";
import ReactDOM from "react-dom";
import "./asset/css/design.scss";
import { Provider } from "react-redux";
import * as serviceWorker from "./serviceWorker";
//import configureStore from "./configureStore";
import App from "./App";
import { combineReducers } from "redux";
//import annotatorReducer from "./modules/annotator";
import annotatorReducer from "./modules/annotator/reducer";
import { applyMiddleware, compose, createStore } from "redux";

const rootReducer = combineReducers({
  annotatorReducer,
});

const store = createStore(rootReducer, applyMiddleware());

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
