import React, { useState, useEffect, useRef } from "react";

import { LabelMode, changeMode } from "../../../modules/annotator";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../index";
import imgLabelSelectMode from "../../../asset/images/label_select_mode.png";
import imgLabelCreateMode from "../../../asset/images/label_create_mode.png";
import Button from "../../../component/atoms/button/Button";

import "./LabelingModeBar.scss";

export default function LabelingModeBar() {
  const [mode, setMode] = useState<LabelMode>(LabelMode.Select);
  const refModeBtnList = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const labelMode = useSelector((state: RootState) => state.annotatorReducer.mode);

  useEffect(() => {
    console.log("LabelMode useEffect: [props.mode]");
    const refModeBtnDiv = refModeBtnList.current;
    if (refModeBtnDiv === null) {
      return;
    }
    refModeBtnDiv.childNodes.forEach((modeBtnEle) => {
      const modeBtn = modeBtnEle as HTMLButtonElement;
      labelMode === LabelMode[modeBtn.id] ? modeBtn.classList.add("active") : modeBtn.classList.remove("active");
    });
  }, [labelMode]);

  const clickBtn = (evt: React.FormEvent<HTMLButtonElement>) => {
    const clickedMode: string = evt.currentTarget.id;
    if (mode === clickedMode) {
      return;
    }
    const refModeBtnDiv = refModeBtnList.current;
    if (refModeBtnDiv === null) {
      return;
    }
    refModeBtnDiv.childNodes.forEach((modeBtnEle) => {
      const modeBtn = modeBtnEle as HTMLButtonElement;
      if (clickedMode === modeBtn.id) {
        modeBtn.classList.add("active");
      } else {
        modeBtn.classList.remove("active");
      }
    });
    setMode(LabelMode[clickedMode]);
    dispatch(changeMode({ mode: LabelMode[clickedMode] }));
  };

  return (
    <div className="labeling-mode-bar" ref={refModeBtnList}>
      <Button className={"btn label-mode-btn active"} onClick={clickBtn} id={LabelMode.Select}>
        <img className={"btn-img"} src={imgLabelSelectMode} alt={"select-mode"} />
      </Button>
      <Button className={"btn label-mode-btn"} onClick={clickBtn} id={LabelMode.Create}>
        <img className={"btn-img"} src={imgLabelCreateMode} alt={"create-mode"} />
      </Button>
    </div>
  );
}
