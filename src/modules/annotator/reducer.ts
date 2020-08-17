import { parseTransform } from "../../util/common";
import { createReducer } from "typesafe-actions";
import * as actions from "./actions";
import { AnnotatorState, AnnotatorAction, Images, Labels, Data, LABEL_SELECT_MODE } from "./types";

const initialState: AnnotatorState = {
  mode: LABEL_SELECT_MODE as string,
  currentImgURL: "" as string,
  images: {} as Images,
  labels: {} as Labels,
  selectedLabelsIds: [] as Array<number>,
};

// const handleViewImage = (state: AnnotatorState, action: AnnotatorAction): AnnotatorState => {
//   if (action.type !== actions.VIEW_IMAGE) {
//     return state;
//   }

//   let _images: Images;
//   if (state.images[action.payload.url]) {
//     _images = { ...state.images };
//   } else {
//     _images = { ...state.images, [action.payload.url]: { title: action.payload.title, x: 0, y: 0, scale: 1 } };
//   }
//   return {
//     ...state,
//     mode: LABEL_SELECT_MODE,
//     images: _images,
//     currentImgURL: action.payload.url,
//     selectedLabelsIds: [],
//   };
// };

const annotatorReducer = createReducer<AnnotatorState, AnnotatorAction>(initialState, {
  [actions.VIEW_IMAGE]: (state, action) => {
    let _images: Images;
    if (state.images[action.payload.url]) {
      _images = { ...state.images };
    } else {
      _images = { ...state.images, [action.payload.url]: { title: action.payload.title, x: 0, y: 0, scale: 1 } };
    }
    return {
      ...state,
      mode: LABEL_SELECT_MODE,
      images: _images,
      currentImgURL: action.payload.url,
      selectedLabelsIds: [],
    };
  },
  [actions.CHANGE_MODE]: (state, action) => {
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
      const tf = parseTransform(label) as Data;
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

const getLabelState = (label: SVGGElement) => {
  const id = Number(label.dataset.id);
  const name = label.dataset.name;
  const tf = parseTransform(label) as Data;
  const data = { x: tf.x, y: tf.y, w: tf.w, h: tf.h, deg: tf.deg };

  const theta = (Math.PI / 180) * tf.deg;
  const cos_t = Math.cos(theta);
  const sin_t = Math.sin(theta);

  const c_x = tf.x + tf.rotX;
  const c_y = tf.y + tf.rotY;

  const nw_x = tf.x;
  const nw_y = tf.y;
  const ne_x = tf.x + tf.w;
  const ne_y = tf.y;
  const se_x = tf.x + tf.w;
  const se_y = tf.y + tf.h;
  const sw_x = tf.x;
  const sw_y = tf.y + tf.h;

  let nw_xp = (nw_x - c_x) * cos_t - (nw_y - c_y) * sin_t + c_x;
  let nw_yp = (nw_x - c_x) * sin_t + (nw_y - c_y) * cos_t + c_y;
  let ne_xp = (ne_x - c_x) * cos_t - (ne_y - c_y) * sin_t + c_x;
  let ne_yp = (ne_x - c_x) * sin_t + (ne_y - c_y) * cos_t + c_y;
  let se_xp = (se_x - c_x) * cos_t - (se_y - c_y) * sin_t + c_x;
  let se_yp = (se_x - c_x) * sin_t + (se_y - c_y) * cos_t + c_y;
  let sw_xp = (sw_x - c_x) * cos_t - (sw_y - c_y) * sin_t + c_x;
  let sw_yp = (sw_x - c_x) * sin_t + (sw_y - c_y) * cos_t + c_y;

  nw_xp = parseFloat(nw_xp.toFixed(2));
  nw_yp = parseFloat(nw_yp.toFixed(2));
  ne_xp = parseFloat(ne_xp.toFixed(2));
  ne_yp = parseFloat(ne_yp.toFixed(2));
  se_xp = parseFloat(se_xp.toFixed(2));
  se_yp = parseFloat(se_yp.toFixed(2));
  sw_xp = parseFloat(sw_xp.toFixed(2));
  sw_yp = parseFloat(sw_yp.toFixed(2));

  // coordinates
  // 0 1
  // 3 2
  const coordinates = [];
  coordinates.push({ x: nw_xp, y: nw_yp });
  coordinates.push({ x: ne_xp, y: ne_yp });
  coordinates.push({ x: se_xp, y: se_yp });
  coordinates.push({ x: sw_xp, y: sw_yp });

  return { id: id, name: name, coordinates: coordinates, data: data };
};
