import LabelBoard from '../components/LabelBoard';
import { connect } from 'react-redux';
import { selectLabels, createLabel, updateImage, updateLabels, updateAll, deleteLabels } from '../modules/annotator';

const mapStateToProps = state => {
    let _labels = state.annotator.labels.filter(label => label.url === state.annotator.curImgURL);
    let _image = state.annotator.images.find(image => image.url === state.annotator.curImgURL);
    return {
        mode: state.annotator.mode
        ,curImgURL: state.annotator.curImgURL
        ,selectedLabelIds: state.annotator.selectedLabelIds
        ,image: _image
        ,labels: _labels
    };
}

const mapDispatchToProps = dispatch => {
    return {
        selectLabels: ids => dispatch(selectLabels(ids))
        ,createLabel: label => dispatch(createLabel(label))
        ,updateImage: image => dispatch(updateImage(image))
        ,updateLabels: (labels, ids) => dispatch(updateLabels(labels, ids))
        ,updateAll: (image, labels, ids) => dispatch(updateAll(image, labels, ids))
        ,deleteLabels: ids => dispatch(deleteLabels(ids))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LabelBoard);