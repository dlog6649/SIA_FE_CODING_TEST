import { connect } from "react-redux";
import LabelList from "../component/LabelList";
import { selectLabels } from "../modules/annotator/actions";
import { RootState } from "../index";

const mapStateToProps = (state: RootState) => {
  return {
    mode: state.annotatorReducer.mode,
    labels: state.annotatorReducer.labels[state.annotatorReducer.currentImgURL],
    selectedLabelsIds: state.annotatorReducer.selectedLabelsIds,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    selectLabels: (selectedLabelsIds: Array<number>) => dispatch(selectLabels({ selectedLabelsIds: selectedLabelsIds })),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LabelList);
