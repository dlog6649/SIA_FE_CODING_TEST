import LabelBoard from '../components/LabelBoard';
import { connect } from 'react-redux';
import { selectLabels, createLabels, updateLabels, updateImgLabels, deleteLabels } from '../modules/annotator';


const mapStateToProps = state => {
    return {
        mode: state.annotator.mode
        ,curImgURL: state.annotator.curImgURL
        ,selLblIds: state.annotator.selLblIds
        ,img: state.annotator.imgs[state.annotator.curImgURL]
        ,lbls: state.annotator.lbls[state.annotator.curImgURL]
    };
}


const mapDispatchToProps = dispatch => {
    return {
        selectLabels: ids => dispatch(selectLabels(ids))
        ,createLabels: lbls => dispatch(createLabels(lbls))
        ,updateLabels: (lbls, ids) => dispatch(updateLabels(lbls, ids))
        ,updateImgLabels: (img, lbls) => dispatch(updateImgLabels(img, lbls))
        ,deleteLabels: ids => dispatch(deleteLabels(ids))
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(LabelBoard);