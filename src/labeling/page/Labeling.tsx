import React from "react";
import { Route, RouteComponentProps, Switch } from "react-router";
import LabelingHome from "./labeling-home/LabelingHome";
import LabelingDetail from "./labeling-detail/LabelingDetail";
import * as routes from "../../routes";

export default function Labeling(props: RouteComponentProps) {
  return (
    <Switch>
      <Route exact path={props.match.path} component={LabelingHome} />
      <Route path={`${props.match.path}:id`} component={LabelingDetail} />
    </Switch>
  );
}
