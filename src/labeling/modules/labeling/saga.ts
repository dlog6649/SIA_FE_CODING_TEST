import { takeLatest } from "redux-saga/effects";
import { taker } from "../../../common/modules/saga-util";
import axios from "axios";
import { GET_IMAGE_LIST, GetImageListAction, Image } from "./types";

const proxyurl = "https://cors-anywhere.herokuapp.com/";

function getImageList(action: GetImageListAction) {
  return axios.get("https://jsonplaceholder.typicode.com/photos");
}

export function* labelingSaga() {
  yield taker(GET_IMAGE_LIST, getImageList, takeLatest);
}
