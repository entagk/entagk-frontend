import { START_LOADING, END_LOADING } from "../actions/auth";
import { GET_TEMPLATES_FOR_USER, DELETE_TEMPLATE } from "../actions/templates";

const initialState = {
  template: [],
  tempTasks: {},
  isLoading: false,
  userTemplates: {},
}

// eslint-disable-next-line
export default (state = initialState, action) => {
  switch (action.type) {
    case START_LOADING:
      return {
        ...state,
        isLoading: action.data === 'templates' ? true : state.isLoading
      };

    case END_LOADING:
      return {
        ...state,
        isLoading: action.data === 'templates' ? false : state.isLoading
      };

    case GET_TEMPLATES_FOR_USER:
      console.log(action.data)
      return {
        ...state,
        userTemplates: action.data
      };

    case DELETE_TEMPLATE:
      const tempId = action.data.deletedTemplate._id
      const filterTemplates = state.userTemplates.templates.filter((t) => t._id !== tempId);
      const tempTasks = Object.entries(state.tempTasks).filter(t => t[0] !== tempId);

      return {
        ...state,
        userTemplates: { ...state.userTemplates, templates: filterTemplates },
        tempTasks: tempTasks.reduce((a, e) => ({ ...a, [e[0]]: e[1] }), {}),
      }

    default:
      return state;
  }
}
