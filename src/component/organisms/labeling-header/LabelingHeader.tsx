import React from "react";
import { useHistory } from "react-router-dom";

import * as routes from "../../../Routes";
import Button from "../../atoms/button/Button";

import "./LabelingHeader.scss";
import { Home, ArrowLeft, ArrowRight } from "../../../asset/icons";

export default function LabelingHeader() {
  const history = useHistory();
  // const imgTitle = useSelector((state: RootState) =>
  //   state.annotatorReducer.images[state.annotatorReducer.currentImgURL] === undefined
  //     ? ""
  //     : state.annotatorReducer.images[state.annotatorReducer.currentImgURL].title,
  // );
  const imgTitle = "adflakjwflajwelfklawklgjwgj";

  return (
    <div className={"labeling-header"}>
      <Button className={"home-btn"} type={"ghost"} onClick={() => history.push(routes.labelingHome)}>
        <Home />
      </Button>
      <section className={"section-history"}>
        <Button className={"history-btn"}>
          <ArrowLeft />
        </Button>
        <Button className={"history-btn"}>
          <ArrowRight />
        </Button>
      </section>
      <section className={"section-title"} title={imgTitle}>
        {imgTitle}
      </section>
    </div>
  );
}
