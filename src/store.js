import {createStore} from 'redux';

export default createStore((state, action) => {
    if(state === undefined) {
        return {type:'HOME'};
    }
    
    let newState = {};
    if(action.type === 'HOME'){
        newState = Object.assign(newState, state, action);
        console.log('HOME, newState: ', newState);
    }
    else if(action.type === 'LABEL'){
        newState = Object.assign(newState, state, action);
        console.log('LABEL, newState: ', newState);
    }
    else if(action.type === 'MODE'){
        newState = Object.assign(newState, state, action);
        console.log('MODE, newState: ', newState);
    }
    else if(action.type === 'SELECT'){
        newState = Object.assign(newState, state, action);
        console.log('SELECT, newState: ', newState);
    }
    else if(action.type === 'UPDATE'){
        newState = Object.assign(newState, state, action);
        console.log('UPDATE, newState: ', newState);
    }

    return newState;
});