const VIEW_IMAGE = 'annotator/VIEW_IMAGE';
const CHANGE_MODE = 'annotator/CHANGE_MODE';
const SELECT_LABELS = 'annotator/SELECT_LABELS';
const CREATE_LABELS = 'annotator/CREATE_LABELS';
const UPDATE_LABELS = 'annotator/UPDATE_LABELS';
const UPDATE_IMG_LABELS = 'annotator/UPDATE_IMG_LABELS';
const DELETE_LABELS = 'annotator/DELETE_LABELS';


export const LABEL_SELECT_MODE = 'LABEL_SELECT_MODE';
export const LABEL_CREATE_MODE = 'LABEL_CREATE_MODE';


export const viewImage = (url, title) => ({ type: VIEW_IMAGE, url, title });
export const changeMode = mode => ({ type: CHANGE_MODE, mode });
export const selectLabels = ids => ({ type: SELECT_LABELS, ids });
export const createLabels = lbls => ({ type: CREATE_LABELS, lbls });
export const updateLabels = (lbls, ids) => ({ type: UPDATE_LABELS, lbls, ids });
export const updateImgLabels = (img, lbls) => ({ type: UPDATE_IMG_LABELS, img, lbls });
export const deleteLabels = ids => ({ type: DELETE_LABELS, ids });


const initialState = {
    mode: LABEL_SELECT_MODE
    ,curImgURL: ''
    ,imgs: {}
    ,lbls: {}
    ,selLblIds: []
};


export default function annotator (state = initialState, action) {

    switch (action.type) {
        case VIEW_IMAGE:
            var _imgs;

            if (state.imgs[action.url]) {
                _imgs = {...state.imgs};
            }
            else {
                _imgs = {...state.imgs, [action.url]: {title: action.title, x: 0, y: 0, scale: 1}};
            }

            return {
                ...state
                ,mode: LABEL_SELECT_MODE
                ,imgs: _imgs
                ,curImgURL: action.url
                ,selLblIds: []
            };
        case CHANGE_MODE:
            var newState =  {...state, mode: action.mode};

            if (state.selLblIds.length !== 0) {
                newState = {...newState, selLblIds: []};
            }
            return newState;
        case SELECT_LABELS:
            return {
                ...state
                ,selLblIds: action.ids
            };
        case CREATE_LABELS:
            // 최초 생성시 초기화
            var preLbls = state.lbls[state.curImgURL] === undefined ? [] : [...state.lbls[state.curImgURL]];

            for (let lbl of action.lbls) {
                var _id = lbl.dataset.id;
                var _name = lbl.dataset.name;
                var transform = lbl.getAttribute('transform').split(' ');
                var _x = parseFloat(transform[0].substring(10));
                var _y = parseFloat(transform[1].split(')')[0]);
                var _w = parseFloat(lbl.firstChild.getAttribute('width'));
                var _h = parseFloat(lbl.firstChild.getAttribute('height'));

                // coordinates
                // 0 1
                // 3 2
                var _coordinates = [];
                _coordinates.push({x: _x, y: _y});
                _coordinates.push({x: parseFloat((_x + _w).toFixed(2)), y: _y});
                _coordinates.push({x: parseFloat((_x + _w).toFixed(2)), y: parseFloat((_y + _h).toFixed(2))});
                _coordinates.push({x: _x, y: parseFloat((_y + _h).toFixed(2))});

                preLbls.push({id: _id, name: _name, coordinates: _coordinates});
            }

            var _lbls = {...state.lbls, [state.curImgURL]: preLbls};
            
            return {
                ...state
                ,lbls: _lbls
            };
        case UPDATE_LABELS:
            var _lbls = {...state.lbls};
            var updLbls = [];

            for (let lbl of action.lbls) {
                var _id = lbl.dataset.id;
                var _name = lbl.dataset.name;

                var transform = lbl.getAttribute('transform').split(' ');
                var _x = parseFloat(transform[0].substring(10));
                var _y = parseFloat(transform[1].split(')')[0]);
                var _w = parseFloat(lbl.firstChild.getAttribute('width'));
                var _h = parseFloat(lbl.firstChild.getAttribute('height'));

                // coordinates
                // 0 1
                // 3 2
                var _coordinates = [];
                _coordinates.push({x: _x, y: _y});
                _coordinates.push({x: parseFloat((_x + _w).toFixed(2)), y: _y});
                _coordinates.push({x: parseFloat((_x + _w).toFixed(2)), y: parseFloat((_y + _h).toFixed(2))});
                _coordinates.push({x: _x, y: parseFloat((_y + _h).toFixed(2))});

                updLbls.push({id: _id, name: _name, coordinates: _coordinates});
            }

            _lbls[state.curImgURL] = updLbls;

            return {
                ...state
                ,lbls: _lbls
                ,selLblIds: action.ids
            };
        case UPDATE_IMG_LABELS:
            var _title = state.imgs[state.curImgURL].title;
            var transForm = action.img.getAttribute('transform').split(' ');
            var imgX = parseFloat(transForm[0].substring(10));
            var imgY = parseFloat(transForm[1].split(')')[0]);
            var _scale = parseFloat(transForm[2].substring(6).split(')')[0]);
            var _imgs = {...state.imgs, [state.curImgURL]: {title: _title, x: imgX, y: imgY, scale: _scale}};

            var updLbls = [];

            for (let lbl of action.lbls) {
                var _id = lbl.dataset.id;
                var _name = lbl.dataset.name;

                var transform = lbl.getAttribute('transform').split(' ');
                var _x = parseFloat(transform[0].substring(10));
                var _y = parseFloat(transform[1].split(')')[0]);
                var _w = parseFloat(lbl.firstChild.getAttribute('width'));
                var _h = parseFloat(lbl.firstChild.getAttribute('height'));

                // coordinates
                // 0 1
                // 3 2
                var _coordinates = [];
                _coordinates.push({x: _x, y: _y});
                _coordinates.push({x: parseFloat((_x + _w).toFixed(2)), y: _y});
                _coordinates.push({x: parseFloat((_x + _w).toFixed(2)), y: parseFloat((_y + _h).toFixed(2))});
                _coordinates.push({x: _x, y: parseFloat((_y + _h).toFixed(2))});

                updLbls.push({id: _id, name: _name, coordinates: _coordinates});
            }

            var _lbls = {...state.lbls};
            _lbls[state.curImgURL] = updLbls;

            return {
                ...state
                ,imgs: _imgs
                ,lbls: _lbls
            };
        case DELETE_LABELS:
            var _lbls = {...state.lbls};
            var _lblsArray = [..._lbls[state.curImgURL]];

            for(let id of action.ids) {
                let idx = _lblsArray.findIndex(_lbl => _lbl.id === id);
                _lblsArray.splice(idx, 1);
            }

            _lbls[state.curImgURL] = _lblsArray;

            return {
                ...state
                ,lbls: _lbls
                ,selLblIds: []
            };
        default:
            return state;
    }
}
