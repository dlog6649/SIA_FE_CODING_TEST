import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import * as LabelMain from "./labeling-tool/LabelMain";
import { redrawImage, redrawLabels } from "./labeling-tool/LabelCreator";
import { compareIds, compareImage, compareLabels } from "./labeling-tool/LabelCompare";
import LabelCtxMenu from "./LabelCtxMenu";
import { RootState } from "../../../../index";
import { Plus, Minus } from "../../../../common/asset/icons";

import "./LabelingBoard.scss";

export let dispatch: any;
export let _setScale: React.Dispatch<React.SetStateAction<number>>;

export default function LabelBoardContainer() {
  const [scale, setScale] = useState<number>(1);
  const dispatcher = useDispatch();
  const mode = useSelector((state: RootState) => state.annotatorReducer.mode);
  const currentImgURL = useSelector((state: RootState) => state.annotatorReducer.currentImgURL);
  const selectedLabelsIds = useSelector((state: RootState) => state.annotatorReducer.selectedLabelsIds);
  const image = useSelector((state: RootState) => state.annotatorReducer.images[state.annotatorReducer.currentImgURL]);
  const labels = useSelector((state: RootState) => state.annotatorReducer.labels[state.annotatorReducer.currentImgURL]);

  useEffect(() => {
    console.log("LabelBoard useEffect: []");
    dispatch = dispatcher;
    _setScale = setScale;
    LabelMain.initialize();
    return () => LabelMain.finalize();
  }, []);

  useEffect(() => {
    console.log("LabelBoard useEffect: [mode]: ", mode);
    if (LabelMain.getMode() === mode) {
      console.log("useEffect: [mode]: returned ");
      return;
    }
    LabelMain.setMode(mode);
  }, [mode]);

  useEffect(() => {
    console.log("LabelBoard useEffect: [image]: ");
    if (compareImage(image)) {
      console.log("LabelBoard useEffect: [image]: returned");
      return;
    }
    redrawImage(currentImgURL, image);
  }, [image]);

  useEffect(() => {
    console.log("LabelBoard useEffect: [labels]: ");
    if (compareLabels(labels)) {
      console.log("LabelBoard useEffect: [labels]: returned");
      return;
    }
    redrawLabels(labels);
  }, [labels]);

  useEffect(() => {
    console.log("LabelBoard useEffect: [selectedLabelsIds]: ");
    if (compareIds(selectedLabelsIds)) {
      console.log("LabelBoard useEffect: [selectedLabelsIds]: returned");
      return;
    }
    LabelMain.createAnchorsInSelectedLabelsIds(selectedLabelsIds);
  }, [selectedLabelsIds]);

  const changeScale = (evt: any): void => {
    setScale(parseFloat(evt.target.value));
  };

  const changeSliderCSS = (evt: any): void => {
    const evtTarget = evt.target;
    let { value } = evtTarget;
    if (value <= 0.1) {
      value = 0;
    }
    evtTarget.style.background = `linear-gradient(to right, #333333 0%, #333333 ${value * 50}%, #dedede ${value * 50}%, #dedede 100%)`;
  };

  return (
    <div className="label-board">
      <svg id="svg" width="100%" height="100%" data-testid="testSvg">
        <defs>
          <filter id="f1">
            <feDropShadow dx="-1" dy="1" stdDeviation="2.5" floodColor="gray" />
          </filter>
        </defs>
      </svg>
      <div className="label-board-scaler">
        <Plus className={"plus"} />
        <input
          className="scaler-range"
          type="range"
          data-testid="testScaler"
          value={scale}
          onInput={changeSliderCSS}
          onChange={changeScale}
          min="0.1"
          max="2"
          step="0.1"
        />
        <Minus className={"minus"} />
      </div>
      <LabelCtxMenu />
    </div>
  );
}
