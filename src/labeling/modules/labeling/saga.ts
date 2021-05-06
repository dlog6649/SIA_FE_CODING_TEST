import { takeLatest } from "redux-saga/effects"
import { taker } from "../../../common/modules/util"
import axios from "axios"
import { PayloadAction } from "@reduxjs/toolkit"
import { GET_IMAGE, GET_IMAGES } from "./index"

export function* labelingSaga() {
  yield taker(takeLatest, GET_IMAGES, () =>
    axios.get(`https://jsonplaceholder.typicode.com/photos`, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
      },
    }),
  )
  yield taker(takeLatest, GET_IMAGE, (action: PayloadAction<string>) =>
    axios.get(`https://jsonplaceholder.typicode.com/photos/${action.payload}`, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
      },
    }),
  )
}
