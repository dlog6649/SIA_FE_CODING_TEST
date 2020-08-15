import { applyMiddleware, compose, createStore } from "redux";
import rootReducer from "./modules";

export default function configureStore(preloadedState) {
  const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const store = createStore(rootReducer(), preloadedState, composeEnhancer(applyMiddleware()));

  return store;
}
