import { createAction, createReducer } from "@reduxjs/toolkit"
import { AsyncSuffix, handleAsyncAction, initAsyncState } from "../../../common/modules/util"
import { LabelingState } from "./types"

export const GET_IMAGES = "labeling/getImages"
const GET_IMAGES_LOADING = `${GET_IMAGES}/${AsyncSuffix.Loading}`
const GET_IMAGES_SUCCESS = `${GET_IMAGES}/${AsyncSuffix.Success}`
const GET_IMAGES_FAILURE = `${GET_IMAGES}/${AsyncSuffix.Failure}`
export const getImages = createAction<void>(GET_IMAGES)

export const GET_IMAGE = "labeling/getImage"
const GET_IMAGE_LOADING = `${GET_IMAGE}/${AsyncSuffix.Loading}`
const GET_IMAGE_SUCCESS = `${GET_IMAGE}/${AsyncSuffix.Success}`
const GET_IMAGE_FAILURE = `${GET_IMAGE}/${AsyncSuffix.Failure}`
export const getImage = createAction<string>(GET_IMAGE)

export const initState: LabelingState = {
  api: {
    getImages: initAsyncState,
    getImage: initAsyncState,
  },
}

export const labelingReducer = createReducer(initState, {
  [GET_IMAGES_LOADING]: (state, action) => handleAsyncAction(state, action),
  [GET_IMAGES_SUCCESS]: (state, action) => {
    action.payload = action.payload.slice(0, 12)
    handleAsyncAction(state, action)
  },
  [GET_IMAGES_FAILURE]: (state, action) => handleAsyncAction(state, action),
  [GET_IMAGE_LOADING]: (state, action) => handleAsyncAction(state, action),
  [GET_IMAGE_SUCCESS]: (state, action) => handleAsyncAction(state, action),
  [GET_IMAGE_FAILURE]: (state, action) => handleAsyncAction(state, action),
})

export * from "./types"
export * from "./saga"
