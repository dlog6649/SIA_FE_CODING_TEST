import React from "react";
import { Route, Switch } from "react-router";
import { BrowserRouter } from "react-router-dom";
import LabelingHome from "./page/labeling-home/LabelingHome";
import LabelingView from "./page/labeling-view/LabelingView";
import * as routes from "./Routes";

import "./App.scss";

// TODO: css modules 적용
// TODO: lodash 적용
// TODO: 도메인 구조로 변경
// TODO: 리덕스 사가 적용 및 핸들러 추가
// TODO: classnames 추가
// TODO: css 정리

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
