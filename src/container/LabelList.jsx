import LabelList from '../components/LabelList';
import { connect } from 'react-redux';
import { selectLabels } from '../modules/annotator';


const mapStateToProps = state => {
    return {
        mode: state.annotator.mode
        ,labels: state.annotator.labels[state.annotator.currentImgURL]
        ,selectedLabelsIds: state.annotator.selectedLabelsIds
    };
}

const mapDispatchToProps = dispatch => {
    return {
        selectLabels: selectedLabelsIds => dispatch(selectLabels(selectedLabelsIds))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LabelList);
