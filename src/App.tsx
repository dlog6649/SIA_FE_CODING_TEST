import React from "react";
import { Route, Switch } from "react-router";
import { BrowserRouter } from "react-router-dom";
import * as routes from "./routes";

import "./App.scss";
import Labeling from "./labeling/page/Labeling";

// TODO: css modules 적용
// TODO: lodash 적용
// TODO: 페이지 구조로 변경
// TODO: 리덕스 사가 적용 및 핸들러 추가
// TODO: classnames 추가
// TODO: css 정리

export default function App() {
  return (
    <div className={"app"}>
      <BrowserRouter>
        <Switch>
          <Route path={routes.labeling} component={Labeling} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}
