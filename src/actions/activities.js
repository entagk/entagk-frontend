import * as api from '../api';
import { END_LOADING, LOGOUT, START_LOADING } from "./auth";
import { calcDays, newDate, types } from '../utils/helper';

export const ADD_ACTIVITY = 'ADD_ACTIVITY';
export const GET_DAY = 'GET_DAY';
export const GET_DAYS = 'GET_DAYS';
export const GET_YEAR = 'GET_YEAR';

export const initToday = {
  "types": [],
  "templates": [],
  "tasks": [],
  "totalMins": 0,
  "userId": "",
  "day": newDate(),
};

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

const changeDayData = (dateType, dataType, today, setData, data) => {
  if (dateType === 'day') {
    const day = data;
    if (day) {
      const max = day?.[dataType]?.reduce((p, c) => p + c?.totalMins, 0);
      if (max !== data?.totalMins) {
        if (dataType === 'tasks') {
          const unknownTask = { name: "unknown task", type: types.at(-1) };
          setData([...day?.[dataType], { ...unknownTask, totalMins: day.totalMins - max }]);
        } else if (dataType === 'templates') {
          setData([...day?.[dataType], { name: 'unknown template', totalMins: day.totalMins - max }])
        } else {
          const unknownType = { typeData: types.at(-1), totalMins: day.totalMins - max };

          setData([...day?.[dataType], unknownType]);
        }
      } else {
        if (data?.[dataType])
          setData(data?.[dataType]);
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

    changeDayData(dateType, dataType, today, setData, data);

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

export const getDays = (start, end, lastData, setData, setMessage) => async dispatch => {
  try {
    dispatch({ type: START_LOADING, data: "activity" });

    const { data } = await api.getDays(start, end);

    const startDate = new Date(start);
    const endDate = new Date(end);
    if (data.length !== ((endDate - startDate) / 1000 / 60 / 60 / 24) + 1) {
      const days = calcDays(start, end).map(d => {
        if (!data.find(dd => dd.day === d)) {
          return { ...initToday, day: d, }
        } else {
          return { day: d, ...data.find(dd => dd.day === d) }
        }
      });

      const all = days.concat(lastData);
      setData(all?.sort((a, b) => a?.day?.localeCompare(b?.day)));
      dispatch({ type: GET_DAYS, data: { days: days, start, end } })
    } else {
      const all = data.concat(lastData);

      setData(all.sort((a, b) => a.day.localeCompare(b.day)));
      dispatch({ type: GET_DAYS, data: { days: data, start, end } })
    }
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

function generateYearDays(year, daysData) {
  // Array to hold all days
  const allDays = [];

  // Get start and end dates
  const start = new Date(`${year}-01-01`);
  const end = new Date(`${year}-12-31`);

  // Loop each day
  let current = start;
  while (current <= end) {
    // Default day object
    let day = {
      day: current.toISOString().slice(0, 10),
      totalMins: 0
    };

    // Check if actual data
    const data = daysData.find(d => d.day === day.day);
    if (data) {
      day = data;
    }

    // Add to all days
    allDays.push(day);

    // Next day
    current.setDate(current.getDate() + 1);
  }

  return allDays;
}

export const getYear = (year, setData, setMessage) => async dispatch => {
  try {
    dispatch({ type: START_LOADING, data: 'activity' });

    const { data } = await api.getYear(year);
    const allDays = generateYearDays(year, data);
    setData(allDays);
    dispatch({ type: GET_YEAR, data: allDays });
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
