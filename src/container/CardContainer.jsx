import CardContainer from '../components/CardContainer';
import {connect} from 'react-redux';

const mapDispatchToProps = dispatch => {
    return {onClick:(_url, _title) => dispatch({type:'LABEL', url:_url, title:_title})};
}

export default connect(null, mapDispatchToProps)(CardContainer);