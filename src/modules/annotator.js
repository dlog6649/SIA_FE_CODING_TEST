const VIEW_IMAGE = 'annotator/VIEW_IMAGE';
const CHANGE_MODE = 'annotator/CHANGE_MODE';
const SELECT_LABELS = 'annotator/SELECT_LABELS';
const CREATE_LABEL = 'annotator/CREATE_LABEL';
const UPDATE_IMAGE = 'annotator/UPDATE_IMAGE'
const UPDATE_LABELS = 'annotator/UPDATE_LABELS';
const DELETE_LABELS = 'annotator/DELETE_LABELS';

export const LABEL_SELECT_MODE = 'LABEL_SELECT_MODE';
export const LABEL_CREATE_MODE = 'LABEL_CREATE_MODE';

export const viewImage = (url, title) => ({ type: VIEW_IMAGE, url, title });
export const changeMode = mode => ({ type: CHANGE_MODE, mode });
export const selectLabels = ids => ({ type: SELECT_LABELS, ids });
export const createLabel = label => ({ type: CREATE_LABEL, label });
export const updateImage = image => ({ type: UPDATE_IMAGE, image });
export const updateLabels = labels => ({ type: UPDATE_LABELS, labels });
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
    let _coordinates = [];

    switch(action.type) {
        case VIEW_IMAGE:

            if(state.images.find(image => image.url === action.url)) {
                _images = [...state.images];
            }
            else {
                _images = [...state.images, {url: action.url, title: action.title, x: 0, y: 0, scale: 1}];
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

            _coordinates = [];
            _coordinates.push({x: action.label.dataset.xCoordinate0, y: action.label.dataset.yCoordinate0});
            _coordinates.push({x: action.label.dataset.xCoordinate1, y: action.label.dataset.yCoordinate1});
            _coordinates.push({x: action.label.dataset.xCoordinate2, y: action.label.dataset.yCoordinate2});
            _coordinates.push({x: action.label.dataset.xCoordinate3, y: action.label.dataset.yCoordinate3});

            _labels = state.labels.concat({url: state.curImgURL, id: action.label.dataset.id, name: action.label.dataset.name, coordinates: _coordinates});
            
            return {
                ...state,
                labels: _labels,
            };
        case UPDATE_IMAGE:
            _images = Array.from(state.images);

            let transForm = action.image.getAttribute('transform').split(' ');
            let _x = Number(transForm[0].substring(10));
            let _y = Number(transForm[1].split(')')[0]);
            let _scale = Number(transForm[2].substring(6).split(')')[0]);

            index = _images.findIndex(img => img.url === state.curImgURL);
            if(index !== -1) {
                _images[index] = {url: state.curImgURL, title: state.curImgTitle, x: _x, y: _y, scale: _scale};
            }

            return {
                ...state,
                images: _images,
            };
        case UPDATE_LABELS:
            _labels = Array.from(state.labels);

            action.labels.forEach(label => {
                index = _labels.findIndex(_label => _label.url === state.curImgURL && _label.id === label.dataset.id);
                if(index === -1) {
                    return true;
                }

                _coordinates = [];
                _coordinates.push({x: label.dataset.xCoordinate0, y: label.dataset.yCoordinate0});
                _coordinates.push({x: label.dataset.xCoordinate1, y: label.dataset.yCoordinate1});
                _coordinates.push({x: label.dataset.xCoordinate2, y: label.dataset.yCoordinate2});
                _coordinates.push({x: label.dataset.xCoordinate3, y: label.dataset.yCoordinate3});

                _labels[index] = {url: state.curImgURL, id: label.dataset.id, name: label.dataset.name, coordinates: _coordinates}
            });

            return {
                ...state,
                images: _images,
                labels: _labels,
            };
        case DELETE_LABELS:
            _labels = Array.from(state.labels);

            action.ids.forEach(id => {
                _labels.splice(_labels.findIndex(_label => _label.url === state.curImgURL && _label.id === id), 1);
            });

            return {
                ...state,
                labels: _labels,
                selectedLabelIds: [],
            };
        default:
            return state;
    }
}
