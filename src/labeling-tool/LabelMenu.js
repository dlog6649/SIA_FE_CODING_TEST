import { _props } from "../components/LabelBoard";
import { LABEL_SELECT_MODE, LABEL_CREATE_MODE } from "../modules/annotator";
import * as LabelMain from "./LabelMain";
import labelNS from "./labelNS";

export const hideDefaultContextmenu = (e) => {
  e.preventDefault();
};

export const hideContextmenu = () => {
  labelNS.contextmenu.style.display = "none";
};

export const showContextmenu = (e) => {
  e.preventDefault();

  if (labelNS.mode === LABEL_CREATE_MODE) {
    return;
  }

  labelNS.menuX = e.offsetX;
  labelNS.menuY = e.offsetY;

  labelNS.contextmenu.style.display = "block";
  labelNS.contextmenu.style.left = `${e.pageX}px`;
  labelNS.contextmenu.style.top = `${e.pageY}px`;

  if (e.target.id === "svg" || e.target.tagName === labelNS.tagNm.IMAGE) {
    document.querySelector(".item.edit").style.display = "none";
    document.querySelector(".item.cut").style.display = "none";
    document.querySelector(".item.copy").style.display = "none";
    document.querySelector(".item.delete").style.display = "none";
  } else {
    document.querySelector(".item.edit").style.display = "block";
    document.querySelector(".item.cut").style.display = "block";
    document.querySelector(".item.copy").style.display = "block";
    document.querySelector(".item.delete").style.display = "block";
  }

  if (!labelNS.cloneLabels.length) {
    document.querySelector(".item.paste").classList.add("disabled");
  } else {
    document.querySelector(".item.paste").classList.remove("disabled");
  }
};

export const buildContextmenu = () => {
  labelNS.contextmenu = document.querySelector(".label-contextmenu");
  labelNS.contextmenu.addEventListener("click", (e) => {
    e.stopPropagation();

    const menu = e.target.tagName === labelNS.tagNm.SPAN ? e.target.parentNode : e.target;

    switch (menu.id) {
      case labelNS.menuNm.EDIT:
        LabelMain.editLabelName();
        break;
      case labelNS.menuNm.CUT:
        LabelMain.copySelectedLabels();
        LabelMain.deleteSelectedLabels();
        break;
      case labelNS.menuNm.COPY:
        LabelMain.copySelectedLabels();
        break;
      case labelNS.menuNm.PASTE:
        LabelMain.pasteCopiedLabels(true);
        break;
      case labelNS.menuNm.DELETE:
        LabelMain.deleteSelectedLabels();
        break;
    }
    labelNS.contextmenu.style.display = "none";
  });
};
