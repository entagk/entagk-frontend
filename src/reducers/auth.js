import { START_LOADING, END_LOADING, AUTH, GET_USER, LOGOUT, DELETE_USER, REFRESH_TOKEN } from "../actions/auth";

// eslint-disable-next-line
export default (state = { user: undefined, authData: undefined, isLoading: false }, action) => {
  switch (action.type) {
    case START_LOADING:
      if (action.data === 'auth')
        document.body.style.overflow = 'hidden'
      return { ...state, isLoading: action.data === "auth" ? true : state.isLoading }
    case END_LOADING:
      if (action.data === 'auth')
        document.body.style.overflow = 'auto';
        document.body.style.overflowX = 'hidden';
      return { ...state, isLoading: action.data === "auth" ? false : state.isLoading }
    case AUTH:
      localStorage.setItem('token', action.data.access_token);
      return { ...state, authData: action.data.access_token };
    case REFRESH_TOKEN:
      localStorage.setItem('token', action.data.refresh_token);
      return { ...state, authData: action.data.refresh_token }
    case GET_USER:
      console.log(action)
      return { ...state, user: action.data };
    case LOGOUT:
    case DELETE_USER:
      localStorage.clear();
      return { ...state, authData: undefined, user: undefined };
    default:
      return state;
  }
}
