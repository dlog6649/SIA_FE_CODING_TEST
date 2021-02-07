import { createSlice } from "@reduxjs/toolkit";

import { getImageListRequest, getImageListFailure, getImageListSuccess } from "./reducers";
import { LabelingState } from "./types";
import { Api } from "../../../common/modules/saga-util";

const initialState: LabelingState = {
  ...Api,
};

export const labelingSlice = createSlice({
  name: "labeling",
  initialState,
  reducers: {
    getImageListRequest,
    getImageListSuccess,
    getImageListFailure,
  },
});

export const labelingReducer = labelingSlice.reducer;
export * from "./types";
export * from "./saga";
