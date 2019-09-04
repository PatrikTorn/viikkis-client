import moment from "moment";
import { createActionPointers } from "../tools/actionTools";
import { getWeekArticles } from "./appActions";
import * as httpService from "../services/httpService";

export const types = createActionPointers([
  `SET_CONFIG_STATE`,
  "NAVIGATE",
  "NAVIGATE_HOME",
  "GET_CONFIG",
  "UPDATE_CONFIG"
]);

export const setConfigState = payload => ({
  type: types.SET_CONFIG_STATE.NAME,
  payload
});

export const navigate = screen => ({
  type: types.NAVIGATE.NAME,
  payload: screen
});

export const getConfig = () => ({
  type: types.GET_CONFIG.NAME,
  payload: httpService.getConfig()
});

export const updateConfig = newConfig => ({
  type: types.UPDATE_CONFIG.NAME,
  payload: httpService.updateConfig(newConfig)
});

export const navigateHome = () => dispatch => {
  // Not in use
  dispatch({ type: types.NAVIGATE_HOME.NAME });
};

export const setNextWeek = () => (dispatch, getState) => {
  const newDate = moment(getState().config.now).add(1, "weeks");
  const week = parseInt(newDate.format("WW"));
  const year = parseInt(newDate.format("YYYY"));
  dispatch(
    setConfigState({
      now: newDate,
      week,
      year
    })
  );
  return dispatch(getWeekArticles({ week, year }));
};

export const setPrevWeek = () => (dispatch, getState) => {
  const newDate = moment(getState().config.now).subtract(1, "weeks");
  const week = parseInt(newDate.format("WW"));
  const year = parseInt(newDate.format("YYYY"));
  dispatch(
    setConfigState({
      now: newDate,
      week,
      year
    })
  );
  return dispatch(getWeekArticles({ week, year }));
};
