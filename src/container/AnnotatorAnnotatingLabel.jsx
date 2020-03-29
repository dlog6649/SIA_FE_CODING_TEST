import AnnotatorAnnotatingLabel from '../components/AnnotatorAnnotatingLabel';
import { connect } from 'react-redux';


const mapStateToProps = state => {
    let _title = state.annotator.imgs[state.annotator.curImgURL] === undefined ? '' : state.annotator.imgs[state.annotator.curImgURL].title;
    return {
        //title: state.annotator.imgs[state.annotator.curImgURL].title
        title: _title // test
    };
}


export default connect(mapStateToProps)(AnnotatorAnnotatingLabel);