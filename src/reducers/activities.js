import { ADD_ACTIVITY } from "../actions/activities";


// eslint-disable-next-line
export default (state = {
  isLoading: false,
  days: [],
}, action) => {
  switch (action.type) {
    case ADD_ACTIVITY:
      return state;
    default:
      return state;
  }
}
