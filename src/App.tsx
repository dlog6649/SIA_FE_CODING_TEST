import React from "react";
import { Route, Switch } from "react-router";
import { BrowserRouter } from "react-router-dom";
import LabelingHome from "./page/labeling-home/LabelingHome";
import LabelingView from "./page/labeling-view/LabelingView";

import "./style/layout.scss";
import "./App.scss";

export default function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={LabelingHome} />
          <Route path="/view" component={LabelingView} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}
