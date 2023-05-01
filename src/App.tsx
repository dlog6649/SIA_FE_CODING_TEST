import React from "react"
import { Route, Routes } from "react-router"

import LabelingHome from "./pages/labeling-home/LabelingHome"
import LabelingView from "./pages/labeling-view/LabelingView"
import Paths from "./shared/Paths"

export default function App() {
  return (
    <Routes>
      <Route path={Paths.root}>
        <Route index element={<LabelingHome />} />
        <Route path={":id"} index element={<LabelingView />} />
      </Route>
      <Route path={"*"} element={<div>{"Page Not Found"}</div>} />
    </Routes>
  )
}
