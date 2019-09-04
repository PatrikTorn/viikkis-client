import { types } from "../actions/configActions";
import moment from "moment";
let initialState = {
  loading: false,
  year: parseInt(moment().format("YYYY")),
  week: parseInt(moment().format("WW")),
  now: moment()
    .day("Wednesday")
    .year(moment().format("YYYY"))
    .week(moment().format("WW")),
  screen: null,
  articleId: null,
  config: {
    email: "",
    guild: "",
    guild_en: "",
    id: "",
    job: "",
    job_en: "",
    name: "",
    phone: "",
    university: "",
    university_en: "",
    url: ""
  }
};

const configReducer = (state = initialState, { payload, type }) => {
  switch (type) {
    case types.SET_CONFIG_STATE.NAME:
      return { ...state, ...payload };
    case types.NAVIGATE.NAME:
      return { ...state, screen: payload };
    case types.NAVIGATE_HOME.NAME:
      return initialState;
    case types.GET_CONFIG.FULFILLED:
      return {
        ...state,
        config: payload.data
      };
    default:
      return state;
  }
};

export default configReducer;
