import { connect } from "react-redux";
import LabelBoard from "../component/LabelBoard";
import { selectLabels, createLabels, updateLabels, updateImgLabels, deleteLabels } from "../modules/annotator/actions";
import { RootState } from "../index";

const mapStateToProps = (state: RootState) => {
  return {
    mode: state.annotatorReducer.mode,
    currentImgURL: state.annotatorReducer.currentImgURL,
    selectedLabelsIds: state.annotatorReducer.selectedLabelsIds,
    image: state.annotatorReducer.images[state.annotatorReducer.currentImgURL],
    labels: state.annotatorReducer.labels[state.annotatorReducer.currentImgURL],
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    selectLabels: (selectedLabelsIds: Array<number>) => dispatch(selectLabels({ selectedLabelsIds: selectedLabelsIds })),
    createLabels: (labels: Array<SVGGElement>) => dispatch(createLabels({ labels: labels })),
    updateLabels: (labels: Array<SVGGElement>, selectedLabelsIds: Array<number>) =>
      dispatch(updateLabels({ labels: labels, selectedLabelsIds: selectedLabelsIds })),
    updateImgLabels: (image: SVGImageElement, labels: Array<SVGGElement>, selectedLabelsIds: Array<number>) =>
      dispatch(updateImgLabels({ image: image, labels: labels, selectedLabelsIds: selectedLabelsIds })),
    deleteLabels: (selectedLabelsIds: Array<number>) => dispatch(deleteLabels({ selectedLabelsIds: selectedLabelsIds })),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LabelBoard);
