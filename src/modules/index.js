import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import annotator from './annotator';

const rootReducer = history => combineReducers({
    router: connectRouter(history)
    ,annotator
});

export default rootReducer;