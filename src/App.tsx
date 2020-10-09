import React from "react";
import { Route, Switch } from "react-router";
import { BrowserRouter } from "react-router-dom";
import LabelingHome from "./page/labeling-home/LabelingHome";
import LabelingView from "./page/labeling-view/LabelingView";
import * as routes from "./Routes";

import "./style/layout.scss";
import "./App.scss";

export default function App() {
  return (
    <div className={"app"}>
      <BrowserRouter>
        <Switch>
          <Route exact path={routes.labelingHome} component={LabelingHome} />
          <Route path={routes.labelingView} component={LabelingView} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}
