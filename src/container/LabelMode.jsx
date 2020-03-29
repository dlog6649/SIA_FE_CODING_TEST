import LabelMode from '../components/LabelMode';
import { connect } from 'react-redux';
import { changeMode } from '../modules/annotator';


const mapStateToProps = state => {
    return {
        mode: state.annotator.mode
    };
}


const mapDispatchToProps = dispatch => {
    return {
        changeMode: mode => dispatch(changeMode(mode))
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(LabelMode);