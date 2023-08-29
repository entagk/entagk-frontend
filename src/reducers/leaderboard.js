import {
  START_LOADING,
  END_LOADING,
} from './../actions/auth';

import { GET_LEADERBOARD } from './../actions/leaderboard';

// eslint-disable-next-line
export default (state = {
  users: [],
  currentPage: 1,
  numberOfPages: 1,
  loaded: false,
}, action) => {
  switch (action.type) {
    case START_LOADING:
      return { ...state, isLoading: action.data === "leaderboard" ? true : state.isLoading }
    case END_LOADING:
      return { ...state, loaded: true, isLoading: action.data === "leaderboard" ? false : state.isLoading }

    case GET_LEADERBOARD:
      console.log(state.users);

      return {
        ...state,
        ...action.data,
        users: action.data.currentPage === 1 ? action.data.users : state.users.concat(action.data.users)
      }

    default:
      return state;
  }
}
