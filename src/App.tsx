import React from "react"
import { Route, Switch } from "react-router"
import { BrowserRouter } from "react-router-dom"
import * as routes from "./routes"

import "./common/styles/color.scss"
import "./common/styles/common.scss"
import styles from "./App.module.scss"
import Labeling from "./labeling/page/Labeling"
import ZoomSlider from "./labeling/page/labeling-view/labeling-board/zoom-slider/ZoomSlider"

// TODO: lodash 적용
// TODO: 리덕스 사가 적용 및 핸들러 추가

export default function App() {
  return (
    <div className={styles.app}>
      {/*<Scaler />*/}
      <BrowserRouter>
        <Switch>
          <Route path={routes.labelingHome} component={Labeling} />
        </Switch>
      </BrowserRouter>
    </div>
  )
}
