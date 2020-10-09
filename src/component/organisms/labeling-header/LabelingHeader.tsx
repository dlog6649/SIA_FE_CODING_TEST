import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import Home from "../../../asset/icon/home/Home";
import { RootState } from "../../../index";
import imgArrowLeft from "../../../asset/images/arrow-left.png";
import * as routes from "../../../Routes";
import Button from "../../atoms/button/Button";

import "./LabelingHeader.scss";

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
          <img src={imgArrowLeft} alt={"back"} />
        </Button>
        <Button className={"history-btn"}>
          <img src={imgArrowLeft} alt={"foward"} />
        </Button>
      </section>
      <section className={"section-title"} title={imgTitle}>
        {imgTitle}
      </section>
    </div>
  );
}
