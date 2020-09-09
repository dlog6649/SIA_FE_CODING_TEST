import React from "react";
import { useSelector } from "react-redux";
import ContentTitle from "../../component/content-title/ContentTitle";
import LabelBoardContainer from "../../container/LabelBoardContainer";
import LabelListContainer from "../../container/LabelListContainer";
import LabelModeBoxContainer from "../../container/LabelModeBoxContainer";
import { RootState } from "../../index";
import imgArrowLeft from "../../asset/images/arrow-left.png";
import { Link } from "react-router-dom";

export default function LabelingView() {
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
      <ContentTitle title={imgTitle} />
      <div className="viewer-content">
        <LabelModeBoxContainer />
        <LabelListContainer />
        <LabelBoardContainer />
      </div>
    </div>
  );
}
