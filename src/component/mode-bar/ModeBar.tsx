import React, { useState, useEffect, useRef } from "react";
import { LabelMode, changeMode } from "../../modules/annotator";
import "./ModeBar.scss";
import Button from "../atoms/button/Button";

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
          <Button className={btn.btnClass} onClick={btn.onClick} id={btn.btnId}>
            <img className={btn.imgClass} src={btn.imgSrc} alt={btn.alt} />
          </Button>
        );
      })}
    </div>
  );
}
