import AnnotatorAnnotatingLabel from '../components/AnnotatorAnnotatingLabel';
import { connect } from 'react-redux';
import { State } from '../modules/annotator';

interface annotatorState {
    annotator: State
}

const mapStateToProps = (state: annotatorState) => {
    let _title = state.annotator.images[state.annotator.currentImgURL] === undefined ? '' : state.annotator.images[state.annotator.currentImgURL].title;
    return {
        title: _title
    };
}

export default connect(mapStateToProps)(AnnotatorAnnotatingLabel);