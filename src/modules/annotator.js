const CHANGE_MODE = 'annotator/CHANGE_MODE';
const SELECT_LABELS = 'annotator/SELECT_LABELS';
const CREATE_LABEL = 'annotator/CREATE_LABEL';
const UPDATE_LABELS = 'annotator/UPDATE_LABELS';
const DELETE_LABELS = 'annotator/DELETE_LABELS';

// const LABEL_SELECT_MODE = 'LABEL_SELECT_MODE';
// const LABEL_CREATE_MODE = 'LABEL_CREATE_MODE';

export const changeMode = mode => ({ type: CHANGE_MODE, mode });
export const selectLabels = ids => ({ type: SELECT_LABELS, ids });
export const createLabel = label => ({ type: CREATE_LABEL, label });
export const updateLabels = (image, labels) => ({ type: UPDATE_LABELS, image, labels });
export const deleteLabels = ids => ({ type: DELETE_LABELS, ids });

const initialState = {
    mode: 'LABEL_SELECT_MODE'
    ,image: {}
    ,labels: [{}]
    ,selectedLabelsIds: []
};

export default function annotator(state = initialState, action) {
    let _labels;
    switch(action.type) {
        case CHANGE_MODE:
            return {
                ...state,
                mode:action.mode,
            };
        case SELECT_LABELS:
            //let _selectedLabelsIds = [];

            // action.labels.forEach(aLabel => {
            //     _labels[_labels.findIndex(_label => _label.id === aLabel.id)] = aLabel;
            // });

            // state.labels.forEach(obj => {
            //     action.ids.forEach(id => {
            //         if(obj.id === id){
            //             _selectedLabelsIds.push(obj);
            //         }
            //     });
            // });
            return {
                ...state,
                selectedLabelsIds: action.ids,
                //selectedLabelsIds:_selectedLabelsIds,
            };
        case CREATE_LABEL:
            _labels = Array.from(state.labels);

            _labels = _labels.concat({id:_labels[_labels.length - 1].id + 1, class:action.label.class, coordinates:action.label.coordinates});

            return {
                ...state,
                labels: _labels,
            };
        case UPDATE_LABELS:
            _labels = Array.from(state.labels);
            

            action.labels.forEach(aLabel => {
                _labels[_labels.findIndex(_label => _label.id === aLabel.id)] = aLabel;
            });

            return {
                ...state,
                image: action.image,
                labels: _labels,
            };
        case DELETE_LABELS:
            _labels = Array.from(state.labels);

            action.ids.forEach(id => {
                _labels.splice(_labels.findIndex(_label => _label.id === id), 1);
            });

            return {
                ...state,
                labels: _labels,
            };
        default:
            return state;
    }
}
