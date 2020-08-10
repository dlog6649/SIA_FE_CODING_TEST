import LabelList from '../components/LabelList';
import { connect } from 'react-redux';
import { selectLabels, State } from '../modules/annotator';

interface annotatorState {
    annotator: State
}

const mapStateToProps = (state: annotatorState) => {
    return {
        mode: state.annotator.mode
        ,labels: state.annotator.labels[state.annotator.currentImgURL]
        ,selectedLabelsIds: state.annotator.selectedLabelsIds
    };
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        selectLabels: (selectedLabelsIds: Array<number>) => dispatch(selectLabels(selectedLabelsIds))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LabelList);
