import React from "react"
import { Route, RouteComponentProps, Switch } from "react-router"
import LabelingHome from "./labeling-home/LabelingHome"
import LabelingView from "./labeling-view/LabelingView"

export default function Labeling({ match: { path } }: RouteComponentProps) {
  return (
    <Switch>
      <Route exact path={path} component={LabelingHome} />
      <Route path={`${path}:id`} component={LabelingView} />
    </Switch>
  )
}
