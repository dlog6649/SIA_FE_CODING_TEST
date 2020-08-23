import * as actions from "./actions";

export interface Images {
  currentImgURL: {
    title: string;
    x: number;
    y: number;
    scale: number;
  };
}

export interface Labels {
  currentImgURL: {
    id: number;
    name: string;
    coordinates: { x: number; y: number }[];
    data: { x: number; y: number; w: number; h: number; deg: number };
  };
}

export interface Data {
  x: number;
  y: number;
  scale: number;
  deg: number;
  rotX: number;
  rotY: number;
  w: number;
  h: number;
}

export interface AnnotatorState {
  mode: LabelMode;
  currentImgURL: string;
  images: Images;
  labels: Labels;
  selectedLabelsIds: Array<number>;
}

export enum LabelMode {
  SELECT = "SELECT",
  CREATE = "CREATE",
}

// export type AnnotatorAction = ActionType<typeof actions>;
