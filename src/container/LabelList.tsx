import { connect } from "react-redux";
import LabelList from "../components/LabelList";
import { selectLabels, AnnotatorState } from "../modules/annotator";

interface State {
  annotator: AnnotatorState;
}

const mapStateToProps = (state: State) => {
  return {
    mode: state.annotator.mode,
    labels: state.annotator.labels[state.annotator.currentImgURL],
    selectedLabelsIds: state.annotator.selectedLabelsIds,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    selectLabels: (selectedLabelsIds: Array<number>) => dispatch(selectLabels(selectedLabelsIds)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LabelList);
