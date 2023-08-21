import { ADD_ACTIVITY, GET_DAY, GET_DAYS, initToday } from "../actions/activities";
import { END_LOADING, START_LOADING } from "../actions/auth";

// eslint-disable-next-line
export default (state = {
  isLoading: false,
  days: [],
  // today: initToday
}, action) => {
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
      const date = new Date().toJSON().split('T')[0];
      if (action.data?.day === date && !state.today) {
        const dayData = !action.data ? { ...initToday, day: date } : action.data;
        const all =
          !state.days.find(d => d.day === action.data.day) ?
            state.days.concat([dayData]) : state.days;
        return {
          ...state,
          today: dayData,
          days: all.filter((d, i) => {
            return !all.findIndex(day => day.day === d.day);
          }),
          total: state.total + 1
        };
      } else {
        const all =
          !state.days.find(d => d.day === action.data.day) ?
            state.days.concat([action.data]) : state.days;
        return {
          ...state,
          days: all.filter((d, i) => {
            return !all.findIndex(day => day.day === d.day);
          }),
          total: state.total + 1
        };
      }
    case GET_DAYS:
      const daysData = action.data.days;

      const all = state.days.concat(daysData).sort((a, b) => a.day.localeCompare(b.day));
      console.log(all);
      return {
        ...state,
        days: all,
        total: all.length
      };

    default:
      return state;
  }
}
