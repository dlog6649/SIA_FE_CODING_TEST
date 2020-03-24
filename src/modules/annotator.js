const VIEW_IMAGE = 'annotator/VIEW_IMAGE';
const CHANGE_MODE = 'annotator/CHANGE_MODE';
const SELECT_LABELS = 'annotator/SELECT_LABELS';
const CREATE_LABEL = 'annotator/CREATE_LABEL';
const UPDATE_LABELS = 'annotator/UPDATE_LABELS';
const DELETE_LABELS = 'annotator/DELETE_LABELS';

export const LABEL_SELECT_MODE = 'LABEL_SELECT_MODE';
export const LABEL_CREATE_MODE = 'LABEL_CREATE_MODE';

export const viewImage = (url, title) => ({ type: VIEW_IMAGE, url, title });
export const changeMode = mode => ({ type: CHANGE_MODE, mode });
export const selectLabels = ids => ({ type: SELECT_LABELS, ids });
export const createLabel = label => ({ type: CREATE_LABEL, label });
export const updateLabels = (image, labels) => ({ type: UPDATE_LABELS, image, labels });
export const deleteLabels = ids => ({ type: DELETE_LABELS, ids });


const initialState = {
    mode: LABEL_SELECT_MODE
    ,curImgURL: ''
    ,curImgTitle: ''
    ,images: []
    ,labels: []
    ,selectedLabelIds: []
};


export default function annotator(state = initialState, action) {
    let _labels = [];
    let _images = [];
    let index = -1;
    let mappedUrlLabels;

    switch(action.type) {
        case VIEW_IMAGE:
            _images = Array.from(state.images);
            
            index = _images.findIndex(image => image.url === action.url);

            if(index === -1 && action.url !== '') {
                _images = [..._images, {url: action.url, title: action.title, x: 0, y: 0, scale: 1}];
            }

            return {
                ...state,
                images: _images,
                curImgURL: action.url,
                curImgTitle: action.title,
            };
        case CHANGE_MODE:
            return {
                ...state,
                mode: action.mode,
            };
        case SELECT_LABELS:
            return {
                ...state,
                selectedLabelIds: action.ids,
            };
        case CREATE_LABEL:
            _labels = Array.from(state.labels);

            let _coordinates = [];
            _coordinates.push({x: action.label.dataset.xCoordinate0, y: action.label.dataset.yCoordinate0});
            _coordinates.push({x: action.label.dataset.xCoordinate1, y: action.label.dataset.yCoordinate1});
            _coordinates.push({x: action.label.dataset.xCoordinate2, y: action.label.dataset.yCoordinate2});
            _coordinates.push({x: action.label.dataset.xCoordinate3, y: action.label.dataset.yCoordinate3});

            _labels = _labels.concat({url: state.curImgURL, id: action.label.dataset.id, name: action.label.dataset.name, coordinates: _coordinates});
            
            return {
                ...state,
                labels: _labels,
            };
        case UPDATE_LABELS:
            _labels = Array.from(state.labels);

            _images = Array.from(state.images);
            index = _images.findIndex(img => img.url === state.curImgURL);
            _images[index] = action.image;

            action.labels.forEach(aLabel => {
                index = _labels.findIndex(_label => {
                    return _label.url === aLabel.url && _label.id === aLabel.id;
                });
                if(index !== -1) {
                    _labels[index] = aLabel;
                }
            });

            return {
                ...state,
                images: _images,
                labels: _labels,
            };
        case DELETE_LABELS:
            _labels = Array.from(state.labels);

            action.ids.forEach(id => {
                _labels.splice(_labels.findIndex(_label => {
                    return _label.url === state.curImgURL && _label.id === id;
                }), 1);
            });

            return {
                ...state,
                labels: _labels,
            };
        default:
            return state;
    }
}
