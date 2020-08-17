import { connect } from "react-redux";
import AnnotatorAnnotatingLabel from "../components/AnnotatorAnnotatingLabel";
import { AnnotatorState } from "../modules/annotator";

interface State {
  annotator: AnnotatorState;
}

const mapStateToProps = (state: State) => {
  const _title =
    state.annotator.images[state.annotator.currentImgURL] === undefined ? "" : state.annotator.images[state.annotator.currentImgURL].title;
  return {
    title: _title,
  };
};

export default connect(mapStateToProps)(AnnotatorAnnotatingLabel);
