import { connect } from "react-redux";
import LabelMode from "../components/LabelMode";
import { changeMode, AnnotatorState } from "../modules/annotator";

interface State {
  annotator: AnnotatorState;
}

const mapStateToProps = (state: State) => {
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
