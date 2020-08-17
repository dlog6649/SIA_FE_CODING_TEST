import { connect } from "react-redux";
import LabelBoard from "../components/LabelBoard";
import { selectLabels, createLabels, updateLabels, updateImgLabels, deleteLabels, AnnotatorState } from "../modules/annotator";

interface State {
  annotator: AnnotatorState;
}

const mapStateToProps = (state: State) => {
  return {
    mode: state.annotator.mode,
    currentImgURL: state.annotator.currentImgURL,
    selectedLabelsIds: state.annotator.selectedLabelsIds,
    image: state.annotator.images[state.annotator.currentImgURL],
    labels: state.annotator.labels[state.annotator.currentImgURL],
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    selectLabels: (selectedLabelsIds: Array<number>) => dispatch(selectLabels(selectedLabelsIds)),
    createLabels: (labels: Array<SVGGElement>) => dispatch(createLabels(labels)),
    updateLabels: (labels: Array<SVGGElement>, selectedLabelsIds: Array<number>) => dispatch(updateLabels(labels, selectedLabelsIds)),
    updateImgLabels: (image: SVGImageElement, labels: Array<SVGGElement>, selectedLabelsIds: Array<number>) =>
      dispatch(updateImgLabels(image, labels, selectedLabelsIds)),
    deleteLabels: (selectedLabelsIds: Array<number>) => dispatch(deleteLabels(selectedLabelsIds)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LabelBoard);