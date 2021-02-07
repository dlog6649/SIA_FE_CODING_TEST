import { CaseReducer, PayloadAction } from "@reduxjs/toolkit";
import { handleAsyncAction } from "../../../common/modules/saga-util";
import { LabelingState, Image } from "./types";

export const getImageListRequest: CaseReducer<LabelingState> = (state, action) => {
  handleAsyncAction(state, action);
};

export const getImageListSuccess: CaseReducer<LabelingState, PayloadAction<Image[]>> = (state, action) => {
  handleAsyncAction(state, action);
};

export const getImageListFailure: CaseReducer<LabelingState, PayloadAction<Error>> = (state, action) => {
  handleAsyncAction(state, action);
};
