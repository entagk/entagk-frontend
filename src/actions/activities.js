import * as api from '../api';
import { END_LOADING, LOGOUT, START_LOADING } from "./auth";

export const ADD_ACTIVITY = 'ADD_ACTIVITY';
export const GET_DAY = 'GET_DAY';
export const GET_DAYS = 'GET_DAYS';

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

const changeData = (dateType, dataType, today, setData, data) => {
  if (dateType === 'day') {
    const day = data;
    if (day) {
      const max = day?.[dataType]?.reduce((p, c) => p + c?.totalMins, 0);

      if (max !== data?.totalMins) {
        setData([
          ...data[dataType],
          {
            name: dataType === 'tasks' ?
              'no task' :
              dataType === 'templates' ?
                'no templates' :
                'types',
            totalMins: data.totalMins - max
          }
        ])
      } else {
        if (today?.[dataType])
          setData(today?.[dataType]);
      }
    } else {
      setData([]);
    }
  }
}

export const getDay = (day, dateType, dataType, today, setData, setMessage) => async dispatch => {
  try {
    dispatch({ type: START_LOADING, data: "activity" });

    const { data } = await api.getDay(day);

    changeData(dateType, dataType, today, setData, data);

    dispatch({ type: GET_DAY, data: { ...data, day } })

  } catch (error) {
    setMessage({ type: 'error', message: error?.response?.data?.message || error.message });
    if (error.response?.status === 401 || error.response?.status === 500) {
      dispatch({ type: LOGOUT });
    }
    console.error(error);
  } finally {
    dispatch({ type: END_LOADING, data: "activity" });
  }
}

export const getDays = (start, end, setMessage) => async dispatch => {
  try {
    dispatch({ type: START_LOADING, data: "activity" });

    const { data } = await api.getDays(start, end);

    dispatch({ type: GET_DAYS, data })

  } catch (error) {
    setMessage({ type: 'error', message: error?.response?.data?.message || error.message });
    if (error.response?.status === 401 || error.response?.status === 500) {
      dispatch({ type: LOGOUT });
    }
    console.error(error);
  } finally {
    dispatch({ type: END_LOADING, data: "activity" });
  }
}
