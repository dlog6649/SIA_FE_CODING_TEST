import { takeLatest } from "redux-saga/effects"
import { taker } from "../../../common/modules/util"
import axios from "axios"
import { PayloadAction } from "@reduxjs/toolkit"
import { GET_IMAGE, GET_IMAGE_LIST } from "./index"

// CORS 문제 생길 시, 호출하는 url 앞쪽에 덧붙여줌
const proxyurl = "https://cors-anywhere.herokuapp.com/"

export function* labelingSaga() {
  yield taker(takeLatest, GET_IMAGE_LIST, () => axios.get("https://jsonplaceholder.typicode.com/photos"))
  yield taker(takeLatest, GET_IMAGE, (action: PayloadAction<string>) =>
    axios.get(`https://jsonplaceholder.typicode.com/photos/${action.payload}`),
  )
}
