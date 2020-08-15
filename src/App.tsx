import React from "react";
import { Route, Switch } from "react-router";
import { BrowserRouter, HashRouter } from "react-router-dom";
import AnnotatorHome from "./components/AnnotatorHome";
import AnnotatorAnnotatingLabel from "./container/AnnotatorAnnotatingLabel";

export default function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={AnnotatorHome} />
          <Route path="/view" component={AnnotatorAnnotatingLabel} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}
