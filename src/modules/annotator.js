const VIEW_IMAGE = 'annotator/VIEW_IMAGE';
const CHANGE_MODE = 'annotator/CHANGE_MODE';
const SELECT_LABELS = 'annotator/SELECT_LABELS';
const CREATE_LABEL = 'annotator/CREATE_LABEL';
const UPDATE_IMAGE = 'annotator/UPDATE_IMAGE';
const UPDATE_LABELS = 'annotator/UPDATE_LABELS';
const UPDATE_ALL = 'annotator/UPDATE_ALL';
const DELETE_LABELS = 'annotator/DELETE_LABELS';

export const LABEL_SELECT_MODE = 'LABEL_SELECT_MODE';
export const LABEL_CREATE_MODE = 'LABEL_CREATE_MODE';

export const viewImage = (url, title) => ({ type: VIEW_IMAGE, url, title });
export const changeMode = mode => ({ type: CHANGE_MODE, mode });
export const selectLabels = ids => ({ type: SELECT_LABELS, ids });
export const createLabel = label => ({ type: CREATE_LABEL, label });
export const updateImage = image => ({ type: UPDATE_IMAGE, image });
export const updateLabels = (labels, ids) => ({ type: UPDATE_LABELS, labels, ids });
export const updateAll = (image, labels, ids) => ({ type: UPDATE_ALL, image, labels, ids });
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
    switch(action.type) {
        case VIEW_IMAGE:

            if(state.images.find(image => image.url === action.url)) {
                var _images = [...state.images];
            }
            else {
                var _images = [...state.images, {url: action.url, title: action.title, x: 0, y: 0, scale: 1}];
            }

            return {
                ...state,
                mode: LABEL_SELECT_MODE,
                images: _images,
                curImgURL: action.url,
                curImgTitle: action.title,
                selectedLabelIds: [],
            };
        case CHANGE_MODE:
            return {
                ...state,
                mode: action.mode,
                selectedLabelIds: [],
            };
        case SELECT_LABELS:
            return {
                ...state,
                selectedLabelIds: action.ids,
            };
        case CREATE_LABEL:

            var _coordinates = [];
            _coordinates.push({x: action.label.dataset.xCoordinate0, y: action.label.dataset.yCoordinate0});
            _coordinates.push({x: action.label.dataset.xCoordinate1, y: action.label.dataset.yCoordinate1});
            _coordinates.push({x: action.label.dataset.xCoordinate2, y: action.label.dataset.yCoordinate2});
            _coordinates.push({x: action.label.dataset.xCoordinate3, y: action.label.dataset.yCoordinate3});

            var _labels = state.labels.concat({url: state.curImgURL, id: action.label.dataset.id, name: action.label.dataset.name, coordinates: _coordinates});
            
            return {
                ...state,
                labels: _labels,
            };
        case UPDATE_IMAGE:
            var _images = Array.from(state.images);

            var transForm = action.image.getAttribute('transform').split(' ');
            var _x = parseFloat(transForm[0].substring(10));
            var _y = parseFloat(transForm[1].split(')')[0]);
            var _scale = parseFloat(transForm[2].substring(6).split(')')[0]);

            var index = _images.findIndex(img => img.url === state.curImgURL);
            if(index !== -1) {
                _images[index] = {url: state.curImgURL, title: state.curImgTitle, x: _x, y: _y, scale: _scale};
            }

            return {
                ...state,
                images: _images,
            };
        case UPDATE_LABELS:
            var _labels = Array.from(state.labels);

            action.labels.forEach(label => {
                var index = _labels.findIndex(_label => _label.url === state.curImgURL && _label.id === label.dataset.id);
                if(index === -1) {
                    return true;
                }

                var _coordinates = [];
                _coordinates.push({x: label.dataset.xCoordinate0, y: label.dataset.yCoordinate0});
                _coordinates.push({x: label.dataset.xCoordinate1, y: label.dataset.yCoordinate1});
                _coordinates.push({x: label.dataset.xCoordinate2, y: label.dataset.yCoordinate2});
                _coordinates.push({x: label.dataset.xCoordinate3, y: label.dataset.yCoordinate3});

                _labels[index] = {url: state.curImgURL, id: label.dataset.id, name: label.dataset.name, coordinates: _coordinates}
            });

            return {
                ...state,
                labels: _labels,
                selectedLabelIds: action.ids,
            };
        case UPDATE_ALL:

            var _images = Array.from(state.images);

            var transForm = action.image.getAttribute('transform').split(' ');
            var _x = parseFloat(transForm[0].substring(10));
            var _y = parseFloat(transForm[1].split(')')[0]);
            var _scale = parseFloat(transForm[2].substring(6).split(')')[0]);

            var index = _images.findIndex(img => img.url === state.curImgURL);
            if(index !== -1) {
                _images[index] = {url: state.curImgURL, title: state.curImgTitle, x: _x, y: _y, scale: _scale};
            }

            var _labels = Array.from(state.labels);

            action.labels.forEach(label => {
                index = _labels.findIndex(_label => _label.url === state.curImgURL && _label.id === label.dataset.id);
                if(index === -1) {
                    return true;
                }

                var _coordinates = [];
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
                selectedLabelIds: action.ids,
            };
        case DELETE_LABELS:
            var _labels = Array.from(state.labels);

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
