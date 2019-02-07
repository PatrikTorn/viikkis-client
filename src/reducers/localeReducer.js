import {types} from '../actions/localeActions';

let initialState = {
    lang:'fi'
};

const localeReducer = (state = initialState, {payload, type}) => {
    switch(type) {
        case types.SET_LOCALE.NAME:
            return {...state, lang:payload}
        default:
            return state;
    }
}

export default localeReducer;