import AnnotatorAnnotatingLabel from '../components/AnnotatorAnnotatingLabel';
import { connect } from 'react-redux';


const mapStateToProps = state => {
    let _title = state.annotator.images[state.annotator.currentImgURL] === undefined ? '' : state.annotator.images[state.annotator.currentImgURL].title;
    return {
        title: _title
    };
}

export default connect(mapStateToProps)(AnnotatorAnnotatingLabel);