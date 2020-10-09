import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../index";
import imgArrowLeft from "../../../asset/images/arrow-left.png";
import { Link } from "react-router-dom";
import * as routes from "../../../Routes";
import Button from "../../atoms/button/Button";
import { useHistory } from "react-router-dom";
// import "./LabelingHeader.scss";

export default function LabelingHeader() {
  const history = useHistory();
  // const imgTitle = useSelector((state: RootState) =>
  //   state.annotatorReducer.images[state.annotatorReducer.currentImgURL] === undefined
  //     ? ""
  //     : state.annotatorReducer.images[state.annotatorReducer.currentImgURL].title,
  // );
  const imgTitle = "adflakjwflajwelfklawklgjwgj";

  return (
    <div className={"labeling-header"}>
      <section className={"section-history"}>
        <Button className={"history-btn"} onClick={() => history.push(routes.labelingHome)}>
          <img src={imgArrowLeft} alt={"home"} />
        </Button>
      </section>
      <section className={"section-title"} title={imgTitle}>
        {imgTitle}
      </section>
    </div>
  );
}

// import React, { useState, useEffect, useRef } from "react";
// import { LabelMode, changeMode } from "../modules/annotator";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "../../index";
// import ModeBar from "../../component/mode-bar/ModeBar";
// import imgLabelSelectMode from "../asset/images/label_select_mode.png";
// import imgLabelCreateMode from "../asset/images/label_create_mode.png";
// import Button from "../../component/atoms/button/Button";

// export default function ModeBarContainer() {
//   const [mode, setMode] = useState<LabelMode>(LabelMode.SELECT);
//   const refModeBtnList = useRef<HTMLDivElement>(null);
//   const dispatch = useDispatch();
//   const labelMode = useSelector((state: RootState) => state.annotatorReducer.mode);

//   useEffect(() => {
//     console.log("LabelMode useEffect: [props.mode]");
//     const refModeBtnDiv = refModeBtnList.current;
//     if (!refModeBtnDiv) {
//       return;
//     }
//     refModeBtnDiv.childNodes.forEach((modeBtnEle) => {
//       const modeBtn = modeBtnEle as HTMLButtonElement;
//       labelMode === LabelMode[modeBtn.id] ? modeBtn.classList.add("active") : modeBtn.classList.remove("active");
//     });
//   }, [labelMode]);

//   const clickBtn = (evt: React.FormEvent<HTMLButtonElement>) => {
//     const clickedMode: string = evt.currentTarget.id;
//     if (mode === clickedMode) {
//       return;
//     }
//     const refModeBtnDiv = refModeBtnList.current;
//     if (!refModeBtnDiv) {
//       return;
//     }
//     refModeBtnDiv.childNodes.forEach((modeBtnEle) => {
//       const modeBtn = modeBtnEle as HTMLButtonElement;
//       if (clickedMode === modeBtn.id) {
//         modeBtn.classList.add("active");
//       } else {
//         modeBtn.classList.remove("active");
//       }
//     });
//     setMode(LabelMode[clickedMode]);
//     dispatch(changeMode({ mode: LabelMode[clickedMode] }));
//   };

//   const btns = [
//     {
//       btnId: LabelMode.SELECT,
//       btnClass: "btn label-mode-btn active",
//       onClick: clickBtn,
//       imgClass: "btn-img",
//       imgSrc: imgLabelSelectMode,
//       alt: "SELECT",
//     },
//     { btnId: LabelMode.CREATE, btnClass: "btn label-mode-btn", onClick: clickBtn, imgClass: "btn-img", imgSrc: imgLabelCreateMode, alt: "CREATE" },
//   ];

//   return <ModeBar mode={labelMode} clickBtn={clickBtn} btns={btns} />;
// }

// import React, { useState, useEffect, useRef } from "react";
// import { LabelMode, changeMode } from "../../modules/annotator";
// import "./ModeBar.scss";
// import Button from "../../atoms/button/Button";

// type Props = {
//   mode: LabelMode;
//   clickBtn: (evt: any) => void;
//   btns: any;
// };

// export default function ModeBar({ mode, clickBtn, btns }: Props) {
//   // const [mode, setMode] = useState<LabelMode>(LabelMode.SELECT);
//   const refModeBtnList = useRef<HTMLDivElement>(null);

//   // useEffect(() => {
//   //   console.log("LabelMode useEffect: [props.mode]");
//   //   if (!refModeBtnList.current) {
//   //     return;
//   //   }
//   //   const refModeBtnDiv = refModeBtnList.current;
//   //   refModeBtnDiv.childNodes.forEach((modeBtnEle) => {
//   //     const modeBtn = modeBtnEle as HTMLButtonElement;
//   //     labelMode === LabelMode[modeBtn.id] ? modeBtn.classList.add("active") : modeBtn.classList.remove("active");
//   //   });
//   // }, [labelMode]);

//   // const clickBtn = (evt: React.FormEvent<HTMLButtonElement>) => {
//   //   const clickedMode: string = evt.currentTarget.id;
//   //   if (mode === clickedMode) {
//   //     return;
//   //   }
//   //   const refModeBtnDiv = refModeBtnList.current;
//   //   if (!refModeBtnDiv) {
//   //     return;
//   //   }
//   //   refModeBtnDiv.childNodes.forEach((modeBtnEle) => {
//   //     const modeBtn = modeBtnEle as HTMLButtonElement;
//   //     if (clickedMode === modeBtn.id) {
//   //       modeBtn.classList.add("active");
//   //     } else {
//   //       modeBtn.classList.remove("active");
//   //     }
//   //   });
//   //   setMode(LabelMode[clickedMode]);
//   //   dispatch(changeMode({ mode: LabelMode[clickedMode] }));
//   // };

//   return (
//     <aside className="mode-bar" ref={refModeBtnList}>
//       {btns.map((btn: any) => {
//         return (
//           <Button className={btn.btnClass} onClick={btn.onClick} id={btn.btnId}>
//             <img className={btn.imgClass} src={btn.imgSrc} alt={btn.alt} />
//           </Button>
//         );
//       })}
//     </aside>
//   );
// }
// btnId: LabelMode.SELECT,
//       btnClass: "btn label-mode-btn active",
//       onClick: clickBtn,
//       imgClass: "btn-img",
//       imgSrc: imgLabelSelectMode,
//       alt: "SELECT",
