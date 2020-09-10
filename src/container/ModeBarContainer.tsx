import React, { useState, useEffect, useRef } from "react";
import { LabelMode, changeMode } from "../modules/annotator";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../index";
import ModeBar from "../component/mode-bar/ModeBar";
import imgLabelSelectMode from "../asset/images/label_select_mode.png";
import imgLabelCreateMode from "../asset/images/label_create_mode.png";

export default function ModeBarContainer() {
  const [mode, setMode] = useState<LabelMode>(LabelMode.SELECT);
  const refModeBtnList = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const labelMode = useSelector((state: RootState) => state.annotatorReducer.mode);

  useEffect(() => {
    console.log("LabelMode useEffect: [props.mode]");
    const refModeBtnDiv = refModeBtnList.current;
    if (!refModeBtnDiv) {
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
    if (!refModeBtnDiv) {
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

  const btns = [
    {
      btnId: LabelMode.SELECT,
      btnClass: "btn label-mode-btn active",
      onClick: clickBtn,
      imgClass: "btn-img",
      imgSrc: imgLabelSelectMode,
      alt: "SELECT",
    },
    { btnId: LabelMode.CREATE, btnClass: "btn label-mode-btn", onClick: clickBtn, imgClass: "btn-img", imgSrc: imgLabelCreateMode, alt: "CREATE" },
  ];

  return <ModeBar mode={labelMode} clickBtn={clickBtn} btns={btns} />;
}
