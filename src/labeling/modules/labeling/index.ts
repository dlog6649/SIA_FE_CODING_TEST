import { createAction, createReducer } from "@reduxjs/toolkit"
import { handleAsyncAction, initAsyncState } from "../../../common/modules/util"
import { LabelingState } from "./types"

export const GET_IMAGE_LIST = "labeling/getImageList"
const GET_IMAGE_LIST_LOADING = "labeling/getImageList/Loading"
const GET_IMAGE_LIST_SUCCESS = "labeling/getImageList/Success"
const GET_IMAGE_LIST_FAILURE = "labeling/getImageList/Failure"
export const getImageList = createAction<void>(GET_IMAGE_LIST)

export const GET_IMAGE = "labeling/getImage"
const GET_IMAGE_LOADING = "labeling/getImage/Loading"
const GET_IMAGE_SUCCESS = "labeling/getImage/Success"
const GET_IMAGE_FAILURE = "labeling/getImage/Failure"
export const getImage = createAction<string>(GET_IMAGE)

const initState: LabelingState = {
  api: {
    getImageList: initAsyncState,
    getImage: initAsyncState,
  },
}

export const labelingReducer = createReducer(initState, {
  [GET_IMAGE_LIST_LOADING]: (state, action) => handleAsyncAction(state, action),
  [GET_IMAGE_LIST_SUCCESS]: (state, action) => {
    action.payload = action.payload.slice(0, 12)
    handleAsyncAction(state, action)
  },
  [GET_IMAGE_LIST_FAILURE]: (state, action) => handleAsyncAction(state, action),
  [GET_IMAGE_LOADING]: (state, action) => handleAsyncAction(state, action),
  [GET_IMAGE_SUCCESS]: (state, action) => handleAsyncAction(state, action),
  [GET_IMAGE_FAILURE]: (state, action) => handleAsyncAction(state, action),
})

export * from "./types"
export * from "./saga"
