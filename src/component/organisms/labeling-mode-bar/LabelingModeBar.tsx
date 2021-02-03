import "./LabelingModeBar.scss";

import React, { useEffect, useRef, useState } from "react";

import { changeMode, LabelMode } from "../../../modules/annotator";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../index";

import Button from "../../../component/atoms/button/Button";
import { CursorDefault, Square } from "../../../asset/icons";

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
        <CursorDefault />
      </Button>
      <Button className={"btn label-mode-btn"} onClick={clickBtn} id={LabelMode.Create}>
        <Square />
      </Button>
    </div>
  );
}
