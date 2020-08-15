import { connect } from "react-redux";
import AnnotatorAnnotatingLabel from "../components/AnnotatorAnnotatingLabel";
import { State } from "../modules/annotator";

interface annotatorState {
  annotator: State;
}

const mapStateToProps = (state: annotatorState) => {
  const _title =
    state.annotator.images[state.annotator.currentImgURL] === undefined ? "" : state.annotator.images[state.annotator.currentImgURL].title;
  return {
    title: _title,
  };
};

export default connect(mapStateToProps)(AnnotatorAnnotatingLabel);
