import React, { useState, useEffect, useRef } from "react";
import { LabelMode } from "../modules/annotator";
import imgLabelSelectMode from "../asset/images/label_select_mode.png";
import imgLabelCreateMode from "../asset/images/label_create_mode.png";

interface Props {
  mode: LabelMode;
  changeMode: (mode: LabelMode) => void;
}

export default function LabelModeBox(props: Props) {
  const [mode, setMode] = useState<LabelMode>(props.mode);
  const refModeBtnList = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("LabelMode useEffect: [props.mode]");
    if (!refModeBtnList.current) {
      return;
    }
    const refModeBtnDiv = refModeBtnList.current;
    refModeBtnDiv.childNodes.forEach((modeBtnEle) => {
      const modeBtn = modeBtnEle as HTMLButtonElement;
      props.mode === LabelMode[modeBtn.id] ? modeBtn.classList.add("active") : modeBtn.classList.remove("active");
    });
  }, [props.mode]);

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
    props.changeMode(LabelMode[clickedMode]);
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
