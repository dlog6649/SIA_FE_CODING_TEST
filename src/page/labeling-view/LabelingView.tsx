import React from "react";
import { useSelector } from "react-redux";
import ContentTitle from "../../component/content-title/ContentTitle";
import LabelBoardContainer from "../../container/LabelBoardContainer";
import LabelListContainer from "../../container/LabelListContainer";
import ModeBarContainer from "../../container/ModeBarContainer";
import { RootState } from "../../index";
import imgArrowLeft from "../../asset/images/arrow-left.png";
import { Link } from "react-router-dom";
import * as routes from "../../Routes";
import Button from "../../component/atoms/button/Button";
import LabelingHeader from "../../component/organisms/labeling-header/LabelingHeader";
import LabelingModeBar from "../../component/organisms/labeling-mode-bar/LabelingModeBar";
import { useHistory } from "react-router-dom";
import "./LabelingView.scss";

export default function LabelingView() {
  const history = useHistory();
  // const imgTitle = useSelector((state: RootState) =>
  //   state.annotatorReducer.images[state.annotatorReducer.currentImgURL] === undefined
  //     ? ""
  //     : state.annotatorReducer.images[state.annotatorReducer.currentImgURL].title,
  // );
  const imgTitle = "adflakjwflajwelfklawklgjwgj";

  return (
    <div className={"labeling-view"}>
      <header className={"header"}>
        <LabelingHeader />
      </header>
      <aside className={"mode-bar"}>
        <LabelingModeBar />
      </aside>
      <main className={"labeling-content"}>
        <LabelListContainer />
        <LabelBoardContainer />
      </main>
    </div>
  );
}
