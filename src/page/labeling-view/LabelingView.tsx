import React from "react";
import { useSelector } from "react-redux";
import { useHistory, Link } from "react-router-dom";

import { RootState } from "../../index";
import * as routes from "../../Routes";
import LabelingHeader from "./labeling-header/LabelingHeader";
import LabelingModeBar from "./labeling-mode-bar/LabelingModeBar";
import LabelListBox from "./label-list-box/LabelListBox";
import LabelingBoard from "./labeling-board/LabelingBoard";

import "./LabelingView.scss";

/**
 * TODO: SVG 보드 TS로 변경
 * TODO: canvas로 변경
 */

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
