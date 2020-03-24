import LabelList from '../components/LabelList';
import { connect } from 'react-redux';
import { selectLabels } from '../modules/annotator';

const mapStateToProps = state => {
    let _labels = state.annotator.labels.filter(label => label.url === state.annotator.curImgURL);
    return {
        labels: _labels,
        selectedLabelIds: state.annotator.selectedLabelIds
    };
}
const mapDispatchToProps = dispatch => {
    return {
        selectLabels: ids => dispatch(selectLabels(ids))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LabelList);