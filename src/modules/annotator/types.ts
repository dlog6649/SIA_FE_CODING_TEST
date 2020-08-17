import { ActionType } from "typesafe-actions";
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
    coordinates: Array<{ x: number; y: number }>;
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
  mode: string;
  currentImgURL: string;
  images: Images;
  labels: Labels;
  selectedLabelsIds: Array<number>;
}

export const LABEL_SELECT_MODE = "LABEL_SELECT_MODE" as const;
export const LABEL_CREATE_MODE = "LABEL_CREATE_MODE" as const;

export type AnnotatorAction = ActionType<typeof actions>;
