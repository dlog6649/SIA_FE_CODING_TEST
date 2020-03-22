import AnnotatorAnnotatingLabel from '../components/AnnotatorAnnotatingLabel';
import {connect} from 'react-redux';

const mapStateToProps = state => {
    return {title:state.title};
}

const mapDispatchToProps = dispatch => {
    return {onClick:() => dispatch({type:'HOME'})};
}

export default connect(mapStateToProps, mapDispatchToProps)(AnnotatorAnnotatingLabel);