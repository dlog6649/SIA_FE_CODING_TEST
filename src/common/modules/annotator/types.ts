//import * as actions from "./actions";

export interface Images {
  currentImgURL: {
    title: string
    x: number
    y: number
    scale: number
  }
}

export interface Label {
  id: number
  name: string
  coordinates: { x: number; y: number }[]
  data: { x: number; y: number; w: number; h: number; deg: number }
}

export interface Labels {
  currentImgURL: {
    id: number
    name: string
    coordinates: { x: number; y: number }[]
    data: { x: number; y: number; w: number; h: number; deg: number }
  }
}

export interface AnnotatorState {
  mode: LabelMode
  currentImgURL: string
  images: Images
  labels: Labels
  selectedLabelsIds: Array<number>
}

export enum LabelMode {
  Select = "SELECT",
  Create = "CREATE",
}

// export type AnnotatorAction = ActionType<typeof actions>;
