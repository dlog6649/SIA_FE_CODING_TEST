import AnnotatorAnnotatingLabel from '../components/AnnotatorAnnotatingLabel';
import { connect } from 'react-redux';


const mapStateToProps = state => {
    return {
        //title: state.annotator.imgs[state.annotator.curImgURL].title
        title: state.annotator.imgs[state.annotator.curImgURL] === undefined ? '' : state.annotator.imgs[state.annotator.curImgURL].title // 테스트용 코드
    };
}


export default connect(mapStateToProps)(AnnotatorAnnotatingLabel);