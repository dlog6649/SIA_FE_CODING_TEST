import LabelList from '../components/LabelList';
import { connect } from 'react-redux';
import { selectLabels } from '../modules/annotator';


const mapStateToProps = state => {
    return {
        mode: state.annotator.mode
        ,lbls: state.annotator.lbls[state.annotator.curImgURL]
        ,selLblIds: state.annotator.selLblIds
    };
}


const mapDispatchToProps = dispatch => {
    return {
        selectLabels: ids => dispatch(selectLabels(ids))
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(LabelList);
