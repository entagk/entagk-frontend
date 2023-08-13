import { START_LOADING, END_LOADING } from "../actions/auth";
import {
  GET_USER_TEMPLATES,
  DELETE_TEMPLATE,
  GET_TEMPLATE_TASKS,
  NEW_TEMPLATE_TASK,
  MODIFY_TEMPLATE_TASK,
  DELETE_TEMPLATE_TASK,
  CREATE_TEMPLATE,
  MODIFY_TEMPLATE,
  SEARCH_USER_TEMPLATRES,
  SORT_USER_TEMPLATRES,
  CHANGE_CURRENT_PAGE,
  TEMPLATE_LIMIT
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

      const userTemplate = state.userTemplates.templates[state.userTemplates.currentPage - 1].find(t => t._id === newTask?.template._id);
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

      const userTemplate2 = state.userTemplates.templates[state.userTemplates.currentPage - 1].find(t => t._id === updatedTask?.template._id);
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

    case GET_USER_TEMPLATES:
      const templates = state.userTemplates.templates || {};
      templates[action.data.currentPage - 1] = action.data.templates;

      if (!(new URLSearchParams(document.location.search).get('search'))) {
        console.log(templates);
        return {
          ...state,
          userTemplates: { ...action.data, templates: templates, hasTemps: action.data.currentPage === 1 && action.data.templates.length === 0 ? false : true, },
          tempTasks: action.data.templates.reduce((all, c) => ({ ...all, [c._id]: {} }), state.tempTasks)
        };
      } else {
        return {
          ...state,
          userTemplates: { ...action.data, templates: templates, hasTemps: state.userTemplates.hasTemps },
          tempTasks: action.data.templates.reduce((all, c) => ({ ...all, [c._id]: {} }), state.tempTasks)
        };
      }

    case CHANGE_CURRENT_PAGE:
      if (action.data.type === 'userTemplates') {
        return {
          ...state,
          userTemplates: { ...state.userTemplates, currentPage: action.data.page }
        }
      } else {
        return state;
      }

    case GET_TEMPLATE_TASKS:
      return {
        ...state,
        tempTasks: { ...state.tempTasks, [action.data.id]: action.data }
      }

    case CREATE_TEMPLATE:
      if (state.userTemplates.numberOfPages === state.userTemplates.currentPage) {
        if ((TEMPLATE_LIMIT * state.userTemplates.numberOfPages) - state.userTemplates.total !== 0) {//22*2-44 = 0
          state.userTemplates.templates[state.userTemplates.numberOfPages - 1].push(action.data);
        } else {
          state.userTemplates.templates[state.userTemplates.numberOfPages] = [action.data]
          state.userTemplates.numberOfPages = state.userTemplates.numberOfPages + 1;
        }

        return {
          ...state,
          userTemplates: {
            ...state.userTemplates,
            total: state.userTemplates.total + 1,
            hasTemps: true,
          }
        }
      } else {
        if ((TEMPLATE_LIMIT * state.userTemplates.numberOfPages) - state.userTemplates.total === 0) {
          state.userTemplates.templates[state.userTemplates.numberOfPages] = [action.data]
          state.userTemplates.numberOfPages = state.userTemplates.numberOfPages + 1;
        } else if (state.userTemplates.templates[state.userTemplates.numberOfPages - 1]) {
          state.userTemplates.templates[state.userTemplates.numberOfPages - 1].push(action.data);
        }
        
        return {
          ...state,
          userTemplates: {
            ...state.userTemplates,
            total: state.userTemplates.total + 1,
            hasTemps: true,
          }
        }
      }

    case MODIFY_TEMPLATE:
      const oldTempIndex = state.userTemplates.templates[state.userTemplates.currentPage - 1].findIndex(t => t._id === action.data._id);

      state.userTemplates.templates[state.userTemplates.currentPage - 1][oldTempIndex] = action.data;

      return state;

    case DELETE_TEMPLATE:
      const tempId = action.data.deletedTemplate._id
      const tempTasks = Object.entries(state.tempTasks).filter(t => t[0] !== tempId);
      if (state.userTemplates.currentPage === state.userTemplates.numberOfPages) {
        const page = state.userTemplates.currentPage;
        console.log(state.userTemplates.templates[page - 1].filter((t) => t._id !== tempId));
        state.userTemplates.templates[page - 1] = state.userTemplates.templates[page - 1].filter((t) => t._id !== tempId);

        return {
          ...state,
          userTemplates: {
            ...state.userTemplates,
            total: state.userTemplates.total - 1,
            currentPage: state.userTemplates.templates[page - 1].length === 0 ? page === 1 ? 1 : page - 1 : page,
            numberOfPages: state.userTemplates.templates[page - 1].length === 0 ? state.userTemplates.numberOfPages - 1 : state.userTemplates.numberOfPages
          },
          tempTasks: tempTasks.reduce((a, e) => ({ ...a, [e[0]]: e[1] }), {}),
        }
      } else {
        const page = state.userTemplates.currentPage;

        return {
          ...state,
          userTemplates: {
            ...state.userTemplates,
            total: state.userTemplates.total - 1,
            numberOfPages: state.userTemplates.templates[page - 1].length === 0 ? state.userTemplates.numberOfPages - 1 : state.userTemplates.numberOfPages
          },
          tempTasks: tempTasks.reduce((a, e) => ({ ...a, [e[0]]: e[1] }), {}),
        }
      }

    case SEARCH_USER_TEMPLATRES:
      const keys = action.data.query.split(" ");
      const result = state.userTemplates.templates[0].filter(item => {
        let found = false;
        keys.forEach(key => {
          found = found || item.name.includes(key) || item.desc.includes(key);
        })

        return found;
      });

      return {
        ...state,
        userTemplates: {
          ...state.userTemplates,
          templates: result,
          total: result.length,
          currentPage: action.data.page,
          numberOfPages: result.length / 25,
        }
      }

    case SORT_USER_TEMPLATRES:
      const sortCallback = (a, b) => {
        if (action.data === 'name') {
          const nameA = a.name.toLowerCase();
          const nameB = b.name.toLowerCase();

          if (nameA < nameB) return -1;
          if (nameA > nameB) return 1;

          return 0;
        } else {
          const updatedAtA = Number(new Date(a.updatedAt));
          const updatedAtB = Number(new Date(b.updatedAt));

          return updatedAtB - updatedAtA;
        }
      }
      return {
        ...state,
        userTemplates: {
          ...state.userTemplates,
          templates: state.userTemplates?.templates[0]?.sort(sortCallback)
        }
      }

    default:
      return state;
  }
}
