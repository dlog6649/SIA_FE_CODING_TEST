import React, { useState, useEffect, useRef } from "react";
import { LabelMode, changeMode } from "../modules/annotator";
import imgLabelSelectMode from "../asset/images/label_select_mode.png";
import imgLabelCreateMode from "../asset/images/label_create_mode.png";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../index";

export default function LabelModeBoxContainer() {
  const [mode, setMode] = useState<LabelMode>(LabelMode.SELECT);
  const refModeBtnList = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const labelMode = useSelector((state: RootState) => state.annotatorReducer.mode);

  useEffect(() => {
    console.log("LabelMode useEffect: [props.mode]");
    if (!refModeBtnList.current) {
      return;
    }
    const refModeBtnDiv = refModeBtnList.current;
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
    if (!refModeBtnList.current) {
      return;
    }
    const refModeBtnDiv = refModeBtnList.current;
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
    <div className="label-mode" ref={refModeBtnList}>
      <button id={LabelMode.SELECT} className="btn label-mode-btn active" type="button" onClick={clickBtn}>
        <img className="btn-img" src={imgLabelSelectMode} alt="SELECT" />
      </button>
      <button id={LabelMode.CREATE} className="btn label-mode-btn" type="button" onClick={clickBtn}>
        <img className="btn-img" src={imgLabelCreateMode} alt="CREATE" />
      </button>
    </div>
  );
}
