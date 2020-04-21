import LabelBoard from '../components/LabelBoard';
import { connect } from 'react-redux';
import { selectLabels, createLabels, updateLabels, updateImgLabels, deleteLabels } from '../modules/annotator';


const mapStateToProps = state => {
    return {
        mode: state.annotator.mode
        ,currentImgURL: state.annotator.currentImgURL
        ,selectedLabelsIds: state.annotator.selectedLabelsIds
        ,image: state.annotator.images[state.annotator.currentImgURL]
        ,labels: state.annotator.labels[state.annotator.currentImgURL]
    };
}

const mapDispatchToProps = dispatch => {
    return {
        selectLabels: selectedLabelsIds => dispatch(selectLabels(selectedLabelsIds))
        ,createLabels: labels => dispatch(createLabels(labels))
        ,updateLabels: (labels, selectedLabelsIds) => dispatch(updateLabels(labels, selectedLabelsIds))
        ,updateImgLabels: (image, labels, selectedLabelsIds) => dispatch(updateImgLabels(image, labels, selectedLabelsIds))
        ,deleteLabels: selectedLabelsIds => dispatch(deleteLabels(selectedLabelsIds))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LabelBoard);