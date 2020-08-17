import { combineReducers } from "redux";
import annotator from "./annotator";

const rootReducer = combineReducers({
  annotator,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
