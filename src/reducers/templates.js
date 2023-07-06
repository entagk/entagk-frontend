import { START_LOADING, END_LOADING } from "../actions/auth";
import {
  GET_TEMPLATES_FOR_USER,
  DELETE_TEMPLATE,
  GET_TEMPLATE_TASKS,
  NEW_TEMPLATE_TASK,
  MODIFY_TEMPLATE_TASK,
  DELETE_TEMPLATE_TASK
} from "../actions/templates";

const initialState = {
  templates: {},
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

    case NEW_TEMPLATE_TASK:
      const newTask = action.data;

      state.tempTasks[newTask.template?._id].tasks = state.tempTasks[newTask.template?._id].tasks.concat([newTask]);
      state.tempTasks[newTask.template?._id].tasks.total = ++state.tempTasks[newTask.template?._id].tasks.total;

      const userTemplate = state.userTemplates.templates.find(t => t._id === newTask?.template._id);
      userTemplate.tasks = [...userTemplate.tasks, newTask._id];
      userTemplate.est = userTemplate.est + newTask.est;

      return {
        ...state,
        templates: state.templates?.templates ?
          {
            ...state.templates,
            templates: [...state.templates.templates.filter(t => t._id !== updatedTask.template._id), userTemplate],
          }
          : state.templates
      }

    case MODIFY_TEMPLATE_TASK:
      const updatedTask = action.data;

      const { est } = state.tempTasks[updatedTask.template._id].tasks.filter(t => t._id === updatedTask._id)[0];

      state.tempTasks[updatedTask.template?._id].tasks = [...state.tempTasks[updatedTask.template?._id].tasks.filter(t => t._id !== updatedTask._id), updatedTask];

      const userTemplate2 = state.userTemplates.templates.find(t => t._id === updatedTask?.template._id);
      userTemplate2.est = userTemplate2.est - est + updatedTask.est;

      return {
        ...state,
        templates: state.templates?.templates ?
          {
            ...state.templates,
            templates: [...state.templates.templates.filter(t => t._id !== updatedTask.template._id), userTemplate2],
          }
          : state.templates
      }

    case DELETE_TEMPLATE_TASK:
      const deletedTask = state.tempTasks[action.data.template._id].tasks.filter(t => t._id === action.data.id)[0];

      state.tempTasks[deletedTask.template?._id].tasks = state.tempTasks[deletedTask.template?._id].tasks.filter(t => t._id !== deletedTask._id);
      state.tempTasks[deletedTask.template?._id].total = state.tempTasks[deletedTask.template?._id].total - 1;

      const userTemplate3 = state.userTemplates.templates.find(t => t._id === deletedTask?.template._id);
      userTemplate3.tasks = userTemplate3.tasks.filter(t => t !== deletedTask._id);
      userTemplate3.est = userTemplate3.est - deletedTask.est;

      return {
        ...state,
        templates: state.templates?.templates ?
          {
            ...state.templates,
            templates: [...state.templates.templates.filter(t => t._id !== updatedTask.template._id), userTemplate2],
          }
          : state.templates

      }

    case GET_TEMPLATES_FOR_USER:
      console.log(action.data)
      return {
        ...state,
        userTemplates: action.data,
        tempTasks: action.data.templates.reduce((all, c) => ({ ...all, [c._id]: {} }), state.tempTasks)
      };

    case GET_TEMPLATE_TASKS:
      return {
        ...state,
        tempTasks: { ...state.tempTasks, [action.data.id]: action.data }
      }

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
