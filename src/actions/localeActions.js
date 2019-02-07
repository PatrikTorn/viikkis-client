import {createActionPointers} from '../tools/actionTools';

const types = createActionPointers([
    'SET_LOCALE'
]);

export const setLocale = (lang) => ({
    type:types.SET_LOCALE.NAME,
    payload:lang
});