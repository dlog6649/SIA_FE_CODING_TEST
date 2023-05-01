import React from "react"
import { Route, Routes } from "react-router"

import "./common/styles/color.scss"
import "./common/styles/common.scss"
import LabelingHome from "./labeling/page/labeling-home/LabelingHome"
import LabelingView from "./labeling/page/labeling-view/LabelingView"
import * as routes from "./routes"

export default function App() {
  return (
    <Routes>
      <Route path={routes.LABELING_HOME_PATH}>
        <Route index element={<LabelingHome />} />
        <Route path={":id"} index element={<LabelingView />} />
      </Route>
      <Route path={"*"} element={<div>{"Page Not Found"}</div>} />
    </Routes>
  )
}
