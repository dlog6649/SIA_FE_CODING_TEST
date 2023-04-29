import React from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"
import { combineReducers, configureStore, getDefaultMiddleware } from "@reduxjs/toolkit"
import App from "./App"
import { labelingReducer, labelingSaga } from "./labeling/modules/labeling"
import { all } from "redux-saga/effects"
import createSagaMiddleWare from "redux-saga"

const rootReducer = combineReducers({
  labelingReducer,
})
export type RootState = ReturnType<typeof rootReducer>

const saga = createSagaMiddleWare()

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware().concat(saga),
})

function* rootSaga() {
  yield all([labelingSaga()])
}
saga.run(rootSaga)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root"),
)
