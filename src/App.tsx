import React from "react"
import { Route, Switch } from "react-router"
import { BrowserRouter } from "react-router-dom"
import * as routes from "./routes"

import "./common/styles/color.scss"
import "./common/styles/common.scss"
import styles from "./App.module.scss"
import Labeling from "./labeling/page/Labeling"

export default function App() {
  return (
    <div className={styles.app}>
      <BrowserRouter>
        <Switch>
          <Route path={routes.LABELING_HOME_PATH} component={Labeling} />
        </Switch>
      </BrowserRouter>
    </div>
  )
}
