import LabelList from '../components/LabelList';
import { connect } from 'react-redux';
import { selectLabels } from '../modules/annotator';

const mapStateToProps = state => {
    console.log('LabelList mapStateToProps: ',state);
    let _labels = state.annotator.labels.filter(label => label.url === state.annotator.curImgURL);
    return {
        mode: state.annotator.mode,
        labels: _labels,
        //labels: state.annotator.labels,
        selectedLabelIds: state.annotator.selectedLabelIds
    };
}
const mapDispatchToProps = dispatch => {
    return {
        selectLabels: ids => dispatch(selectLabels(ids))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LabelList);
