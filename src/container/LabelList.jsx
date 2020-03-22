import LabelList from '../components/LabelList';
import { connect } from 'react-redux';

const mapStateToProps = state => {
    return {labels:state.labels};
}
const mapDispatchToProps = dispatch => {
    return {onClick:_selectedLabels => dispatch({type:'SELECT', selectedLabels:_selectedLabels})}
}

export default connect(mapStateToProps, mapDispatchToProps)(LabelList);