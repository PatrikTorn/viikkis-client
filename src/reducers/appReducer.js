import { types } from "../actions/appActions";
import { toast } from 'react-toastify';
let initialState = {
    loading: false,
    articles: [],
    config:{
        year:null,
        week:null,
        number:null,
        guild:null,
        guild_en: null,
        subject:null,
        url: null,
        name:null,
        job:null,
        job_en:null,
        university:null,
        university_en:null,
        phone:null,
        email:null    
    },
    rooms: {},
    logged: false,
    user: {},
    sockets:[]
};

const appReducer = (state = initialState, { payload, type }) => {

    switch (type) {
        case types.SET_STATE.NAME:
            return { ...state, ...payload }

        case types.GET_ARTICLES.PENDING:
        case types.CREATE_WEEK.PENDING:
        case types.GET_ARTICLE.PENDING:
        case types.DELETE_ARTICLE.PENDING:
        case types.GET_WEEK_ARTICLES.PENDING:
        case types.GET_WEEK_CONFIG.PENDING:
        case types.LOGIN.PENDING:
            return { ...state, loading: true }

        case types.GET_ARTICLES.REJECTED:
        case types.CREATE_WEEK.REJECTED:
        case types.DELETE_ARTICLE.REJECTED:
        case types.GET_ARTICLE.REJECTED:
        case types.GET_WEEK_ARTICLES.REJECTED:
        case types.GET_WEEK_CONFIG.REJECTED:
            toast.error('Ei internet yhteyttä palvelimeen')
            return { ...state, loading: false }

        
        case types.GET_ARTICLES.FULFILLED:
            return { ...state, loading: false, articles: payload.data }

        case types.LOGIN.REJECTED:
            return { ...state, loading: false }

        case types.CREATE_WEEK.FULFILLED:
            return { ...state, articles: [...state.articles, ...payload], loading: false }

        case types.GET_ARTICLE.FULFILLED:
            return { ...state, articles: state.articles.map(a => a.id === payload.id ? payload : a), loading: false }

        case types.DELETE_ARTICLE.FULFILLED:
            return { ...state, articles: state.articles.reduce((acc, a) => a.id === payload.data ? acc : [...acc, a], []), loading: false }

        case types.GET_WEEK_ARTICLES.FULFILLED:
            return { ...state, articles: payload.data, loading: false }

        case types.GET_WEEK_CONFIG.FULFILLED:
            return { ...state, config: payload.data.length > 0 ? payload.data[0] : initialState.config, loading: false }

        case types.LOGIN.FULFILLED:
            return { ...state, user: payload.data, logged: true, loading: false }


        case types.LOGOUT.NAME:
            return { ...state, user: initialState.user, logged: false }

        default:
            return state;
    }
};

export default appReducer
