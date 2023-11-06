import { ADD_ACTIVITY, GET_DAY, GET_DAYS, GET_YEAR, initToday } from "../actions/activities";
import { END_LOADING, START_LOADING, LOGOUT } from "../actions/auth";

import { filterDuplicatedData, newDate } from "../utils/helper";

const initialState = { days: [], isLoading: false };

// eslint-disable-next-line
export default (state = initialState, action) => {
  switch (action.type) {
    case START_LOADING:
      return {
        ...state,
        isLoading:
          action.data === 'activity'
            ? true
            : state.isLoading
      }
    case END_LOADING:
      return {
        ...state,
        isLoading:
          action.data === 'activity'
            ? false
            : state.isLoading
      }
    case ADD_ACTIVITY:
      return { ...state, today: action.date };
    case GET_DAY:
      const date = newDate();
      if (action.data?.day === date) {
        const dayData = !action.data ? { ...initToday, day: date } : action.data;
        const all =
          !state.days.find(d => d.day === action.data.day) ?
            state.days.concat([dayData]) : state.days;
        return {
          ...state,
          today: dayData,
          days: filterDuplicatedData(all, 'day'),
          total: state.total + 1
        };
      } else {
        const all = state.days.concat([action.data]);
        return {
          ...state,
          days: filterDuplicatedData(all, 'day'),
          total: state.total + 1
        };
      }
    case GET_DAYS:
      const daysData = action.data.days;

      const all = filterDuplicatedData(state.days.concat(daysData), 'day').sort((a, b) => a.day.localeCompare(b.day));
      return {
        ...state,
        days: all,
        total: all.length
      };

    case GET_YEAR:
      const yearData = filterDuplicatedData(state.days.concat(action.data), 'day').sort((a, b) => a.day.localeCompare(b.day));
      return {
        ...state,
        days: yearData,
        total: yearData.length
      }

    case LOGOUT:
      return initialState;

    default:
      return state;
  }
}
