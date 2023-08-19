import { ADD_ACTIVITY, GET_DAY, GET_DAYS } from "../actions/activities";
import { END_LOADING, START_LOADING } from "../actions/auth";


const initToday = {
  "types": [],
  "templates": [],
  "tasks": [],
  "totalMins": 0,
  "userId": "",
  "day": new Date().toJSON().split('T')[0],
};

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
      if (action.data?.day === date) {
        return {
          ...state,
          today:
            !action.data ?
              { ...initToday, day: date } :
              action.data
        };
      } else {
        return {
          ...state,
          days: state.days.concat([action.data])
        };
      }
    case GET_DAYS:
      const all = state.days.concat(action.data);
      return {
        ...state,
        days: all,
        total: all.length
      };
    default:
      return state;
  }
}
