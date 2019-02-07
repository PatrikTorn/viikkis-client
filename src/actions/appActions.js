import {createActionPointers} from '../tools/actionTools';
import {API_ENDPOINT} from '../constants';
import axios from 'axios'
import {_PASSWORD, _EMAIL} from '../secret';
import * as httpService from '../services/httpService';
export const types = createActionPointers([
    `SET_STATE`,
    'GET_ARTICLES',
    'UPDATE_ARTICLE',
    'CREATE_WEEK',
    'GET_ARTICLE',
    'DELETE_ARTICLE',
    'LOGIN',
    'LOGOUT',
    'GET_TEXT',
    'GET_WEEK_ARTICLES',
    'GET_WEEK_CONFIG'
]);

export const setState = (payload) => ({
    type:types.SET_STATE.NAME,
    payload
});

export const getArticles = () => ({
    type:types.GET_ARTICLES.NAME,
    payload:httpService.getArticles()
});

export const getWeek = ({year, week}) => dispatch => {
    dispatch(getWeekArticles({year, week}));
    dispatch(getWeekConfig({year, week}));
}

export const getWeekArticles = ({year, week}) => ({
    type:types.GET_WEEK_ARTICLES.NAME,
    payload:httpService.getWeekArticles({year, week})
});

export const getWeekConfig = ({year, week}) => ({
    type:types.GET_WEEK_CONFIG.NAME,
    payload:httpService.getWeekConfig({year, week})
});

export const getArticle = (id) => ({
    type:types.GET_ARTICLE.NAME,
    payload:httpService.getArticle(id)
});

export const deleteArticle = (id) => ({
    type:types.DELETE_ARTICLE.NAME,
    payload:httpService.deleteArticle(id)
});

export const updateArticle = ({id, text}) => ({
    type:types.UPDATE_ARTICLE.NAME,
    payload:httpService.updateArticle({id, text})
});

export const createWeek = ({config, articles}) => async dispatch => {
    dispatch({type:types.CREATE_WEEK.PENDING})
    try {
        const response = await httpService.createWeek(config);
        const week_id = response.data;
        articles = articles.map(a => ({...a, week_id}));
        const payload = await httpService.createArticles(articles);
        dispatch({
            type:types.CREATE_WEEK.FULFILLED,
            payload
        });
    } catch (e) {
        dispatch({type:types.CREATE_WEEK.REJECTED})
    }
};

export const login = ({email, password}) => ({
    type:types.LOGIN.NAME,
    payload:async () => {
        if(email === _EMAIL && password === _PASSWORD){
            return {email, password}
        }else {
            throw new Error('wrong password');
        }
    }
})

export const logout = () => ({
    type:types.LOGOUT.NAME
});
