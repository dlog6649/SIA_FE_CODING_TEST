import { createAction } from "@reduxjs/toolkit";

import { LabelMode } from "./types";

export const VIEW_IMAGE = "annotator/VIEW_IMAGE" as const;
export const CHANGE_MODE = "annotator/CHANGE_MODE" as const;
export const SELECT_LABELS = "annotator/SELECT_LABELS" as const;
export const CREATE_LABELS = "annotator/CREATE_LABELS" as const;
export const UPDATE_LABELS = "annotator/UPDATE_LABELS" as const;
export const UPDATE_IMG_LABELS = "annotator/UPDATE_IMG_LABELS" as const;
export const DELETE_LABELS = "annotator/DELETE_LABELS" as const;

export const viewImage = createAction<{ url: string; title: string }>(VIEW_IMAGE);
export const changeMode = createAction<{ mode: LabelMode }>(CHANGE_MODE);
export const selectLabels = createAction<{ selectedLabelsIds: number[] }>(SELECT_LABELS);
export const createLabels = createAction<{ labels: SVGGElement[] }>(CREATE_LABELS);
export const updateLabels = createAction<{ labels: SVGGElement[]; selectedLabelsIds: number[] }>(UPDATE_LABELS);
export const updateImgLabels = createAction<{ image: SVGImageElement; labels: SVGGElement[]; selectedLabelsIds: number[] }>(UPDATE_IMG_LABELS);
export const deleteLabels = createAction<{ selectedLabelsIds: number[] }>(DELETE_LABELS);
