import LabelMode from '../components/LabelMode';
import { connect } from 'react-redux';

const mapDispatchToProps = dispatch => {
    return {
        onClick:_mode => dispatch({type:'MODE', mode:_mode})
    };
}

export default connect(null, mapDispatchToProps)(LabelMode);