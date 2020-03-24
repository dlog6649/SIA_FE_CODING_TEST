import AnnotatorAnnotatingLabel from '../components/AnnotatorAnnotatingLabel';
import { connect } from 'react-redux';

const mapStateToProps = state => {
    return {title: state.annotator.curImgTitle};
}

export default connect(mapStateToProps)(AnnotatorAnnotatingLabel);