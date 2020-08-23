import { parseTransform, getLabelState } from "../../util/common";
import { createReducer } from "@reduxjs/toolkit";
import * as actions from "./actions";
import { AnnotatorState, Images, Labels, Data, LabelMode } from "./types";

const initialState: AnnotatorState = {
  mode: LabelMode.SELECT,
  currentImgURL: "" as string,
  images: {} as Images,
  labels: {} as Labels,
  selectedLabelsIds: [] as number[],
};

const annotatorReducer = createReducer(initialState, {
  [actions.VIEW_IMAGE]: (state, action) => {
    let _images: Images;
    if (state.images[action.payload.url]) {
      _images = { ...state.images };
    } else {
      _images = { ...state.images, [action.payload.url]: { title: action.payload.title, x: 0, y: 0, scale: 1 } };
    }
    return {
      ...state,
      mode: LabelMode.SELECT,
      images: _images,
      currentImgURL: action.payload.url,
      selectedLabelsIds: [],
    };
  },
  [actions.CHANGE_MODE]: (state, action) => {
    console.log(action.payload.mode);
    let newState = { ...state, mode: action.payload.mode };
    if (state.selectedLabelsIds.length !== 0) {
      newState = { ...newState, selectedLabelsIds: [] };
    }
    return newState;
  },
  [actions.SELECT_LABELS]: (state, action) => {
    return {
      ...state,
      selectedLabelsIds: action.payload.selectedLabelsIds,
    };
  },
  [actions.CREATE_LABELS]: (state, action) => {
    // 최초 생성시 초기화
    const preLabels = state.labels[state.currentImgURL] === undefined ? [] : [...state.labels[state.currentImgURL]];
    for (const label of action.payload.labels) {
      const _id = Number(label.dataset.id);
      const _name = label.dataset.name as string;
      const tf = parseTransform(label); // as Data;
      const _data = { x: tf.x, y: tf.y, w: tf.w, h: tf.h, deg: tf.deg };

      // coordinates
      // 0 1
      // 3 2
      const _coordinates = [];
      _coordinates.push({ x: tf.x, y: tf.y });
      _coordinates.push({ x: tf.x + tf.w, y: tf.y });
      _coordinates.push({ x: tf.x + tf.w, y: tf.y + tf.h });
      _coordinates.push({ x: tf.x, y: tf.y + tf.h });
      preLabels.push({ id: _id, name: _name, coordinates: _coordinates, data: _data });
    }
    const _labels = { ...state.labels, [state.currentImgURL]: preLabels };
    return {
      ...state,
      labels: _labels,
    };
  },
  [actions.UPDATE_LABELS]: (state, action) => {
    const _labels = { ...state.labels };
    const updatedLabels = [];
    for (const label of action.payload.labels) {
      updatedLabels.push(getLabelState(label));
    }
    _labels[state.currentImgURL] = updatedLabels;
    return {
      ...state,
      labels: _labels,
      selectedLabelsIds: action.payload.selectedLabelsIds,
    };
  },
  [actions.UPDATE_IMG_LABELS]: (state, action) => {
    const _title = state.images[state.currentImgURL].title;
    const tf = parseTransform(action.payload.image) as Data;
    const _images = { ...state.images, [state.currentImgURL]: { title: _title, x: tf.x, y: tf.y, scale: tf.scale } };
    const updatedLabels = [];
    for (const label of action.payload.labels) {
      updatedLabels.push(getLabelState(label));
    }
    const _labels = { ...state.labels };
    _labels[state.currentImgURL] = updatedLabels;
    return {
      ...state,
      images: _images,
      labels: _labels,
      selectedLabelsIds: action.payload.selectedLabelsIds,
    };
  },
  [actions.DELETE_LABELS]: (state, action) => {
    const _labels = { ...state.labels };
    const _curImgLabels = [..._labels[state.currentImgURL]];
    for (const id of action.payload.selectedLabelsIds) {
      const idx = _curImgLabels.findIndex((_label) => Number(_label.id) === Number(id));
      if (idx === -1) {
        continue;
      }
      _curImgLabels.splice(idx, 1);
    }
    _labels[state.currentImgURL] = _curImgLabels;
    return {
      ...state,
      labels: _labels,
      selectedLabelsIds: [],
    };
  },
});

export default annotatorReducer;
