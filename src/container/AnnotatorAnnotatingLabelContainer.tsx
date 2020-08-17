import React from "react";
import { useSelector } from "react-redux";
import AnnotatorAnnotatingLabel from "../component/AnnotatorAnnotatingLabel";
import LabelBoardContainer from "../container/LabelBoardContainer";
import LabelListContainer from "../container/LabelListContainer";
import LabelModeContainer from "../container/LabelModeContainer";
import { RootState } from "../index";
import imgArrowLeft from "../asset/images/arrow-left.png";
import { Link, useHistory } from "react-router-dom";

export default function AnnotatorAnnotatingLabelContainer() {
  const imgTitle = useSelector((state: RootState) =>
    state.annotatorReducer.images[state.annotatorReducer.currentImgURL] === undefined
      ? ""
      : state.annotatorReducer.images[state.annotatorReducer.currentImgURL].title,
  );
  return (
    <div className="viewer">
      <Link to="/">
        <img src={imgArrowLeft} alt="home" />
      </Link>
      <AnnotatorAnnotatingLabel title={imgTitle} />
      <div className="viewer-content">
        <LabelModeContainer />
        <LabelListContainer />
        <LabelBoardContainer />
      </div>
    </div>
  );
}
