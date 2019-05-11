import * as appActions from './appActions';
import * as configActions from './configActions';
import * as localeActions from './localeActions';
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';

export const actions = {
    app:appActions,
    config:configActions,
    locale:localeActions
};

export const connector = (state, acts) => {
    return connect(
        state,
        dispatch => () => bindActionCreators({
            ...acts
        }, dispatch)
    );
}


function from(a) {
    return function(actions = actions){
        console.log(a);
        console.log(actions);
    }
}
