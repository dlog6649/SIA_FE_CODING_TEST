import { connect } from "react-redux";
import LabelMode from "../component/LabelMode";
import { changeMode } from "../modules/annotator/actions";
import { RootState } from "../index";

const mapStateToProps = (state: RootState) => {
  return {
    mode: state.annotatorReducer.mode,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    changeMode: (mode: string) => dispatch(changeMode({ mode: mode })),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LabelMode);
