import { parseTransform } from "../../../../util/common";
import * as LabelMain from "./LabelMain";
import labelNS from "./labelNS";

export const compareImage = (_image) => {
  if (!_image) {
    return true;
  }
  const image = document.querySelector("#img");
  if (!image) {
    return false;
  }
  const { x, y, scale } = parseTransform(image);
  if (_image.x !== x || _image.y !== y || _image.scale !== scale) {
    return false;
  }
  return true;
};

export const compareLabels = (_labels) => {
  if (!_labels) {
    _labels = [];
  }
  console.log(_labels.length);
  const labels = [...labelNS.svg.childNodes].filter((node) => node.classList.contains("label"));
  if (_labels.length !== labels.length) {
    return false;
  }
  for (let i = 0; i < labels.length; i++) {
    const { x, y, w, h, deg } = parseTransform(labels[i]);
    const _x = _labels[i].data.x;
    const _y = _labels[i].data.y;
    const _w = _labels[i].data.w;
    const _h = _labels[i].data.h;
    const _deg = _labels[i].data.deg;
    if (x !== _x || y !== _y || w !== _w || h !== _h || deg !== _deg) {
      return false;
    }
  }
  return true;
};

export const compareIds = (propsIds) => {
  const selectedLabelsIds = LabelMain.getSelectedLabelsIds();
  if (selectedLabelsIds.length !== propsIds.length) {
    return false;
  }
  for (let i = 0; i < selectedLabelsIds.length; i++) {
    if (parseInt(selectedLabelsIds[i]) !== parseInt(propsIds[i])) {
      return false;
    }
  }
  return true;
};
