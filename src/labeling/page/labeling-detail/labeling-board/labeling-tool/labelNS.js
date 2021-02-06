import { LabelMode } from "../../../../../common/modules/annotator";

const labelNS = {
  //   9
  // 0 1 2
  // 7 8 3
  // 6 5 4
  CURSOR_LIST: ["nw-resize", "n-resize", "ne-resize", "e-resize", "se-resize", "s-resize", "sw-resize", "w-resize"],
  LABEL_RESIZE: "LABEL_RESIZE",
  LABEL_ROTATOR: "LABEL_ROTATOR",
  LABEL_BODY: "LABEL_BODY",
  menuNm: {
    EDIT: "edit",
    CUT: "cut",
    COPY: "copy",
    PASTE: "paste",
    DELETE: "delete",
  },
  tagNm: {
    LINE: "line",
    CIRCLE: "circle",
    RECT: "rect",
    TEXT: "text",
    FOREIGNOBJECT: "foreignObject",
    IMAGE: "image",
    G: "g",
    SPAN: "SPAN",
  },
  svgNS: "http://www.w3.org/2000/svg",
  svg: null,
  contextmenu: null,
  mode: LabelMode.SELECT,
  curId: 0,
  curScale: 1.0,
  isDrawing: false,
  isDragging: false,
  isPushingSpacebar: false,
  isWritingTxt: false,
  startX: 0,
  startY: 0,
  preX: 0,
  preY: 0,
  preDegree: 0,
  preRotX: 0.0,
  preRotY: 0.0,
  preWidth: 0.0,
  preHeight: 0.0,
  qp0_x: 0.0,
  qp0_y: 0.0,
  pp_x: 0.0,
  pp_y: 0.0,
  menuX: 0,
  menuY: 0,
  curLabel: null,
  selectedLabel: null,
  selectedLabelsInfo: [],
  allLabelsInfo: [],
  cloneLabels: [],
  selectedHandler: null,
  anchor: null,
};

export default labelNS;
