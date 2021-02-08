import { takeLatest } from "redux-saga/effects"
import { taker } from "../../../common/modules/saga-util"
import axios from "axios"
import { GET_IMAGE, GET_IMAGE_LIST, GetImageAction, GetImageListAction } from "./types"

// CORS 문제 생길 시, 호출하는 url 앞쪽에 덧붙여줌
const proxyurl = "https://cors-anywhere.herokuapp.com/"

function getImageList(action: GetImageListAction) {
  return axios.get("https://jsonplaceholder.typicode.com/photos")
}

function getImage(action: GetImageAction) {
  return axios.get(`https://jsonplaceholder.typicode.com/photos/${action.payload.id}`)
}

export function* labelingSaga() {
  yield taker(GET_IMAGE_LIST, getImageList, takeLatest)
  yield taker(GET_IMAGE, getImage, takeLatest)
}
