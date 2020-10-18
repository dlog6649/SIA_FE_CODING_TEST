import React from "react";
import { useSelector } from "react-redux";
import { useHistory, Link } from "react-router-dom";

import { RootState } from "../../index";
import * as routes from "../../Routes";
import LabelingHeader from "../../component/organisms/labeling-header/LabelingHeader";
import LabelingModeBar from "../../component/organisms/labeling-mode-bar/LabelingModeBar";
import LabelListBox from "../../component/organisms/label-list-box/LabelListBox";
import LabelingBoard from "../../component/organisms/labeling-board/LabelingBoard";

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
      <aside className={"list-box"}>
        <LabelListBox />
      </aside>
      <main className={"board"}>
        <LabelingBoard />
      </main>
    </div>
  );
}
