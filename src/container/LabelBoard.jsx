import LabelBoard from '../components/LabelBoard';
import { connect } from 'react-redux';

const mapStateToProps = state => {
    return {mode:state.mode, url:state.url, selectedLabels:state.selectedLabels};
}

const mapDispatchToProps = dispatch => {
    return {
        byCreating:_label => dispatch({type:'CREATE', label:_label})
        ,byDeleting:_label => dispatch({type:'DELETE', label:_label})
        ,updateLabel:_labels => dispatch({type:'UPDATE', labels:_labels})
        ,setSelectedLabelList:_selectedLabelList => dispatch({type:'UPDATE', selectedLabels:_selectedLabelList})
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LabelBoard);