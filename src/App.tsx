import React from "react";
import { Route, Switch } from "react-router";
import { BrowserRouter, HashRouter } from "react-router-dom";
import AnnotatorHomeContainer from "./container/AnnotatorHomeContainer";
import AnnotatorAnnotatingLabelContainer from "./container/AnnotatorAnnotatingLabelContainer";

export default function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={AnnotatorHomeContainer} />
          <Route path="/view" component={AnnotatorAnnotatingLabelContainer} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}
