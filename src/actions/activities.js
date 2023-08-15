import * as api from '../api';
import { LOGOUT } from "./auth";

export const ADD_ACTIVITY = 'ADD_ACTIVITY';

export const addActivity = (activityData, setMessage) => async dispatch => {
  try {
    const { data } = await api.addActivity(activityData);
    dispatch({ type: ADD_ACTIVITY, data });
  } catch (error) {
    setMessage({ type: 'error', message: error?.response?.data?.message || error.message });
    if (error.response?.status === 401 || error.response?.status === 500) {
      dispatch({ type: LOGOUT });
    }
    console.error(error);
  }
}
