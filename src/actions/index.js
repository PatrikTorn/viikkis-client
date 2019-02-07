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

export const connector = (state, acts) => connect(
    state,
    dispatch => bindActionCreators({
        ...acts
    }, dispatch)
)

export const mdp = (dispatch) => (bindActionCreators({
    ...appActions,
    ...configActions,
    ...localeActions
  }, dispatch));

  
export const msp = (state, props) => state

export const Connect = connect(msp, mdp);