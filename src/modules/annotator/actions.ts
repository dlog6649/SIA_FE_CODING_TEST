//import { createAction } from "typesafe-actions";
import { createAction } from "@reduxjs/toolkit";

export const VIEW_IMAGE = "annotator/VIEW_IMAGE" as const;
export const CHANGE_MODE = "annotator/CHANGE_MODE" as const;
export const SELECT_LABELS = "annotator/SELECT_LABELS" as const;
export const CREATE_LABELS = "annotator/CREATE_LABELS" as const;
export const UPDATE_LABELS = "annotator/UPDATE_LABELS" as const;
export const UPDATE_IMG_LABELS = "annotator/UPDATE_IMG_LABELS" as const;
export const DELETE_LABELS = "annotator/DELETE_LABELS" as const;

function withPayloadType<T>() {
  return (t: T) => ({ payload: t });
}

export const viewImage = createAction(VIEW_IMAGE, withPayloadType<{ url: string; title: string }>()); //<{ url: string; title: string }>();
export const changeMode = createAction(CHANGE_MODE, withPayloadType<{ mode: string }>()); //<{ mode: string }>();
export const selectLabels = createAction(SELECT_LABELS, withPayloadType<{ selectedLabelsIds: Array<number> }>()); //<{ selectedLabelsIds: Array<number> }>();
export const createLabels = createAction(CREATE_LABELS, withPayloadType<{ labels: Array<SVGGElement> }>()); //<{ labels: Array<SVGGElement> }>();
export const updateLabels = createAction(UPDATE_LABELS, withPayloadType<{ labels: Array<SVGGElement>; selectedLabelsIds: Array<number> }>()); //<{ labels: Array<SVGGElement>; selectedLabelsIds: Array<number> }>();
export const updateImgLabels = createAction(
  UPDATE_IMG_LABELS,
  withPayloadType<{ image: SVGImageElement; labels: Array<SVGGElement>; selectedLabelsIds: Array<number> }>(),
); //<{
//   image: SVGImageElement;
//   labels: Array<SVGGElement>;
//   selectedLabelsIds: Array<number>;
// }>();
export const deleteLabels = createAction(DELETE_LABELS, withPayloadType<{ selectedLabelsIds: Array<number> }>()); //<{ selectedLabelsIds: Array<number> }>();
