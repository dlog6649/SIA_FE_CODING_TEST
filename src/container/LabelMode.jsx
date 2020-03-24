import LabelMode from '../components/LabelMode';
import { connect } from 'react-redux';
import { changeMode } from '../modules/annotator';

const mapDispatchToProps = dispatch => {
    return {
        changeMode: mode => dispatch(changeMode(mode))
    };
}

export default connect(null, mapDispatchToProps)(LabelMode);