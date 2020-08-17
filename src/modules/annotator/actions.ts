import { createAction } from "typesafe-actions";

export const VIEW_IMAGE = "annotator/VIEW_IMAGE" as const;
export const CHANGE_MODE = "annotator/CHANGE_MODE" as const;
export const SELECT_LABELS = "annotator/SELECT_LABELS" as const;
export const CREATE_LABELS = "annotator/CREATE_LABELS" as const;
export const UPDATE_LABELS = "annotator/UPDATE_LABELS" as const;
export const UPDATE_IMG_LABELS = "annotator/UPDATE_IMG_LABELS" as const;
export const DELETE_LABELS = "annotator/DELETE_LABELS" as const;

export const viewImage = createAction(VIEW_IMAGE)<{ url: string; title: string }>();
export const changeMode = createAction(CHANGE_MODE)<{ mode: string }>();
export const selectLabels = createAction(SELECT_LABELS)<{ selectedLabelsIds: Array<number> }>();
export const createLabels = createAction(CREATE_LABELS)<{ labels: Array<SVGGElement> }>();
export const updateLabels = createAction(UPDATE_LABELS)<{ labels: Array<SVGGElement>; selectedLabelsIds: Array<number> }>();
export const updateImgLabels = createAction(UPDATE_IMG_LABELS)<{
  image: SVGImageElement;
  labels: Array<SVGGElement>;
  selectedLabelsIds: Array<number>;
}>();
export const deleteLabels = createAction(DELETE_LABELS)<{ selectedLabelsIds: Array<number> }>();
