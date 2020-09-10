import React, { useState, useEffect, useRef } from "react";
import { LabelMode, changeMode } from "../../modules/annotator";
import "./ModeBar.scss";

type Props = {
  mode: LabelMode;
  clickBtn: (evt: any) => void;
  btns: any;
};

export default function ModeBar({ mode, clickBtn, btns }: Props) {
  // const [mode, setMode] = useState<LabelMode>(LabelMode.SELECT);
  const refModeBtnList = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   console.log("LabelMode useEffect: [props.mode]");
  //   if (!refModeBtnList.current) {
  //     return;
  //   }
  //   const refModeBtnDiv = refModeBtnList.current;
  //   refModeBtnDiv.childNodes.forEach((modeBtnEle) => {
  //     const modeBtn = modeBtnEle as HTMLButtonElement;
  //     labelMode === LabelMode[modeBtn.id] ? modeBtn.classList.add("active") : modeBtn.classList.remove("active");
  //   });
  // }, [labelMode]);

  // const clickBtn = (evt: React.FormEvent<HTMLButtonElement>) => {
  //   const clickedMode: string = evt.currentTarget.id;
  //   if (mode === clickedMode) {
  //     return;
  //   }
  //   const refModeBtnDiv = refModeBtnList.current;
  //   if (!refModeBtnDiv) {
  //     return;
  //   }
  //   refModeBtnDiv.childNodes.forEach((modeBtnEle) => {
  //     const modeBtn = modeBtnEle as HTMLButtonElement;
  //     if (clickedMode === modeBtn.id) {
  //       modeBtn.classList.add("active");
  //     } else {
  //       modeBtn.classList.remove("active");
  //     }
  //   });
  //   setMode(LabelMode[clickedMode]);
  //   dispatch(changeMode({ mode: LabelMode[clickedMode] }));
  // };

  return (
    <div className="mode-bar" ref={refModeBtnList}>
      {btns.map((btn: any) => {
        return (
          <button id={btn.btnId} className={btn.btnClass} type="button" onClick={btn.onClick}>
            <img className={btn.imgClass} src={btn.imgSrc} alt={btn.alt} />
          </button>
        );
      })}
    </div>
  );
}
