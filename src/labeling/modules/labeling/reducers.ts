import { CaseReducer, PayloadAction } from "@reduxjs/toolkit"
import { handleAsyncAction } from "../../../common/modules/saga-util"
import { LabelingState, Image } from "./types"

export const getImageListLoading: CaseReducer<LabelingState> = (state, action) => handleAsyncAction(state, action)
export const getImageListSuccess: CaseReducer<LabelingState, PayloadAction<Image[]>> = (state, action) => {
  action.payload = action.payload.slice(0, 12)
  handleAsyncAction(state, action)
}
export const getImageListFailure: CaseReducer<LabelingState, PayloadAction<Error>> = (state, action) =>
  handleAsyncAction(state, action)

export const getImageLoading: CaseReducer<LabelingState> = (state, action) => handleAsyncAction(state, action)
export const getImageSuccess: CaseReducer<LabelingState, PayloadAction<Image>> = (state, action) =>
  handleAsyncAction(state, action)
export const getImageFailure: CaseReducer<LabelingState, PayloadAction<Error>> = (state, action) =>
  handleAsyncAction(state, action)
