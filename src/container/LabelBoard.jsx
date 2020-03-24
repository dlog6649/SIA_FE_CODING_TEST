import LabelBoard from '../components/LabelBoard';
import { connect } from 'react-redux';
import { selectLabels, createLabel, updateLabels, deleteLabels } from '../modules/annotator';

const mapStateToProps = state => {
    let _labels = state.annotator.labels.filter(label => label.url === state.annotator.curImgURL);
    //console.log('_labels: ', _labels);
    return {
        mode: state.annotator.mode
        ,curImgURL: state.annotator.curImgURL
        ,selectedLabelIds: state.annotator.selectedLabelIds
        ,labels: _labels
    };
}

const mapDispatchToProps = dispatch => {
    return {
        selectLabels: ids => dispatch(selectLabels(ids))
        ,createLabel: label => dispatch(createLabel(label))
        ,updateLabels: (image, labels) => dispatch(updateLabels(image, labels))
        ,deleteLabels: ids => dispatch(deleteLabels(ids))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LabelBoard);