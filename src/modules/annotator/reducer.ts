import { createReducer, createSelector } from "@reduxjs/toolkit";

import { parseTransform, getLabelState } from "../../util/common";
import * as actions from "./actions";
import { AnnotatorState, Images, Labels, LabelMode } from "./types";

const initialState: AnnotatorState = {
  mode: LabelMode.Select,
  currentImgURL: "" as string,
  images: {} as Images,
  labels: {} as Labels,
  selectedLabelsIds: [] as number[],
};

export const testSelector = createSelector(
  (state: any) => state.annotatorReducer.mode,
  (mode) => mode,
);

const annotatorReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(actions.viewImage, (state, action) => {
      if (!state.images[action.payload.url]) {
        state.images[action.payload.url] = { title: action.payload.title, x: 0, y: 0, scale: 1 };
      }
      state.mode = LabelMode.Select;
      state.currentImgURL = action.payload.url;
      state.selectedLabelsIds = [];
    })
    .addCase(actions.changeMode, (state, action) => {
      state.selectedLabelsIds = [];
      state.mode = action.payload.mode;
    })
    .addCase(actions.selectLabels, (state, action) => {
      state.selectedLabelsIds = action.payload.selectedLabelsIds;
    })
    .addCase(actions.createLabels, (state, action) => {
      if (!state.labels[state.currentImgURL]) {
        state.labels[state.currentImgURL] = [];
      }
      for (const label of action.payload.labels) {
        const id = Number(label.dataset.id);
        const name = label.dataset.name as string;
        const tf = parseTransform(label);
        const data = { x: tf.x, y: tf.y, w: tf.w, h: tf.h, deg: tf.deg };
        // coordinates
        // 0 1
        // 3 2
        const coordinates = [];
        coordinates.push({ x: tf.x, y: tf.y });
        coordinates.push({ x: tf.x + tf.w, y: tf.y });
        coordinates.push({ x: tf.x + tf.w, y: tf.y + tf.h });
        coordinates.push({ x: tf.x, y: tf.y + tf.h });
        state.labels[state.currentImgURL].push({ id: id, name: name, coordinates: coordinates, data: data });
      }
    })
    .addCase(actions.updateLabels, (state, action) => {
      const updatedLabels = [];
      for (const label of action.payload.labels) {
        updatedLabels.push(getLabelState(label));
      }
      state.labels[state.currentImgURL] = updatedLabels;
    })
    .addCase(actions.updateImgLabels, (state, action) => {
      const tf = parseTransform(action.payload.image);
      state.images[state.currentImgURL].x = tf.x;
      state.images[state.currentImgURL].y = tf.y;
      state.images[state.currentImgURL].scale = tf.scale;
      const updatedLabels = [];
      for (const label of action.payload.labels) {
        updatedLabels.push(getLabelState(label));
      }
      state.labels[state.currentImgURL] = updatedLabels;
    })
    .addCase(actions.deleteLabels, (state, action) => {
      const curImgLabels = [...state.labels[state.currentImgURL]];
      for (const id of action.payload.selectedLabelsIds) {
        const idx = curImgLabels.findIndex((lbl) => Number(lbl.id) === Number(id));
        if (idx === -1) {
          continue;
        }
        curImgLabels.splice(idx, 1);
      }
      state.labels[state.currentImgURL] = curImgLabels;
      state.selectedLabelsIds = [];
    });
});

// const annotatorReducer = createReducer(initialState, {
//   [actions.VIEW_IMAGE]: (state, action) => {
//     if (!state.images[action.payload.url]) {
//       state.images[action.payload.url] = { title: action.payload.title, x: 0, y: 0, scale: 1 };
//     }
//     state.mode = LabelMode.SELECT;
//     state.currentImgURL = action.payload.url;
//     state.selectedLabelsIds = [];
//   },
//   [actions.CHANGE_MODE]: (state, action) => {
//     state.selectedLabelsIds = [];
//     state.mode = action.payload.mode;
//   },
//   [actions.SELECT_LABELS]: (state, action) => {
//     state.selectedLabelsIds = action.payload.selectedLabelsIds;
//   },
//   [actions.CREATE_LABELS]: (state, action) => {
//     if (!state.labels[state.currentImgURL]) {
//       state.labels[state.currentImgURL] = [];
//     }
//     for (const label of action.payload.labels) {
//       const id = Number(label.dataset.id);
//       const name = label.dataset.name as string;
//       const tf = parseTransform(label);
//       const data = { x: tf.x, y: tf.y, w: tf.w, h: tf.h, deg: tf.deg };
//       // coordinates
//       // 0 1
//       // 3 2
//       const coordinates = [];
//       coordinates.push({ x: tf.x, y: tf.y });
//       coordinates.push({ x: tf.x + tf.w, y: tf.y });
//       coordinates.push({ x: tf.x + tf.w, y: tf.y + tf.h });
//       coordinates.push({ x: tf.x, y: tf.y + tf.h });
//       state.labels[state.currentImgURL].push({ id: id, name: name, coordinates: coordinates, data: data });
//     }
//   },
//   [actions.UPDATE_LABELS]: (state, action) => {
//     const updatedLabels = [];
//     for (const label of action.payload.labels) {
//       updatedLabels.push(getLabelState(label));
//     }
//     state.labels[state.currentImgURL] = updatedLabels;
//   },
//   [actions.UPDATE_IMG_LABELS]: (state, action) => {
//     const tf = parseTransform(action.payload.image);
//     state.images[state.currentImgURL].x = tf.x;
//     state.images[state.currentImgURL].y = tf.y;
//     state.images[state.currentImgURL].scale = tf.scale;
//     const updatedLabels = [];
//     for (const label of action.payload.labels) {
//       updatedLabels.push(getLabelState(label));
//     }
//     state.labels[state.currentImgURL] = updatedLabels;
//   },
//   [actions.DELETE_LABELS]: (state, action) => {
//     const curImgLabels = [...state.labels[state.currentImgURL]];
//     for (const id of action.payload.selectedLabelsIds) {
//       const idx = curImgLabels.findIndex((lbl) => Number(lbl.id) === Number(id));
//       if (idx === -1) {
//         continue;
//       }
//       curImgLabels.splice(idx, 1);
//     }
//     state.labels[state.currentImgURL] = curImgLabels;
//     state.selectedLabelsIds = [];
//   },
// });

export default annotatorReducer;
