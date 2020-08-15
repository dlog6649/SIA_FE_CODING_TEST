import { connect } from "react-redux";
import LabelMode from "../components/LabelMode";
import { changeMode, State } from "../modules/annotator";

interface annotatorState {
  annotator: State;
}

const mapStateToProps = (state: annotatorState) => {
  return {
    mode: state.annotator.mode,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    changeMode: (mode: string) => dispatch(changeMode(mode)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LabelMode);
