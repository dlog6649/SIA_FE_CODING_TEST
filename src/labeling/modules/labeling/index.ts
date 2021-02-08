import { createSlice } from "@reduxjs/toolkit"

import { getImageListLoading, getImageListFailure, getImageListSuccess } from "./reducers"
import { LabelingState } from "./types"
import { initAsyncState } from "../../../common/modules/saga-util"

const initialState: LabelingState = {
  api: {
    getImageList: initAsyncState,
    getImage: initAsyncState,
  },
}

export const labelingSlice = createSlice({
  name: "labeling",
  initialState,
  reducers: {
    getImageListLoading,
    getImageListSuccess,
    getImageListFailure,
  },
})

export const labelingReducer = labelingSlice.reducer
export * from "./types"
export * from "./saga"
