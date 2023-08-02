import { START_LOADING, END_LOADING, LOGOUT } from "./auth";
import * as api from './../api';

export const GET_USER_TEMPLATES = "GET_USER_TEMPLATES";

export const GET_TEMPLATE_TASKS = "GET_TEMPLATE_TASKS";

export const CHANGE_CURRENT_PAGE = "CHANGE_CURRENT_PAGE";

export const SORT_USER_TEMPLATRES = "SORT_USER_TEMPLATRES";

export const SEARCH_USER_TEMPLATRES = "SEARCH_USER_TEMPLATRES";

export const CREATE_TEMPLATE = "CREATE_TEMPLATE";

export const DELETE_TEMPLATE = "DELETE_TEMPLATE";

export const MODIFY_TEMPLATE = "MODIFY_TEMPLATE";

export const ADD_TO_TODO_LIST = 'ADD_TO_TODO_LIST';

export const NEW_TEMPLATE_TASK = 'NEW_TEMPLATE_TASK';

export const MODIFY_TEMPLATE_TASK = 'MODIFY_TEMPLATE_TASK';

export const DELETE_TEMPLATE_TASK = 'DELETE_TEMPLATE_TASK';

export const TEMPLATE_LIMIT = 2;

export const getTemplatesForUser = (sort, search, page, setMessage) => async dispatch => {
  try {
    dispatch({ type: START_LOADING, data: 'templates' });

    if (!localStorage.getItem('token')) {
      setMessage({ message: "You should be login", type: 'error' });
    } else {
      const { data } = await api.getTempsForUser(sort, page, search || "");
      console.log(data);

      dispatch({
        type: GET_USER_TEMPLATES,
        data: data
      });
    }

    dispatch({ type: END_LOADING, data: 'templates' });
  } catch (err) {
    dispatch({ type: END_LOADING, data: 'templates' });
    console.error(err);
    setMessage({ message: err?.response?.data?.message || err.message, type: 'error' });

    if (err.response?.status === 401 || err.response?.status === 500) {
      dispatch({ type: LOGOUT });
    }
  }
}

export const getTasksForTemplate = (id, page, setMessage, setIsLoading) => async dispatch => {
  try {
    setIsLoading('tasks');
    if (!localStorage.getItem('token')) {
      setMessage({ message: "You should be login", type: 'error' });
    } else {
      const { data } = await api.getTasksForOne(id, page);
      console.log(data);

      dispatch({
        type: GET_TEMPLATE_TASKS,
        data: { ...data, id }
      });
    }

    setIsLoading(null);
  } catch (err) {
    setIsLoading(null);
    console.error(err);
    setMessage({ message: err?.response?.data?.message || err.message, type: 'error' });
  }
}

export const deleteTemplate = (id, pageLen, currentPage, numberOfPages, setIsLoading, setMessage) => async dispatch => {
  try {
    setIsLoading(id);
    if (!id) {
      setMessage({ message: 'invalid template', type: 'error' })
    }

    const { data } = await api.deleteTemplate(id);
    setMessage({ message: "Successfully deleted", type: 'success' });
    dispatch({ type: DELETE_TEMPLATE, data });

    let params = new URLSearchParams(document.location.search);
    let search = params.get('search') || ""
    let sort = params.get('sort') || "updatedAt"

    if (currentPage !== numberOfPages) {
      dispatch(getTemplatesForUser(sort, search, currentPage, setMessage))
    } else if (pageLen === 1) {
      dispatch(getTemplatesForUser(sort, search, currentPage - 1, setMessage))
    }

    setIsLoading(null);
  } catch (error) {
    setIsLoading(null);
    setMessage({
      message: error?.response?.data?.message || error?.message,
      type: 'error'
    })
    console.log(error);

    if (error.response?.status === 401 || error.response?.status === 500) {
      dispatch({ type: LOGOUT });
    }
  }
}

export const addToTodo = (id, setIsLoading, setMessage) => async dispatch => {
  try {
    setIsLoading(id);

    const { data } = await api.addToTodo(id);
    setMessage({ message: "Successfully deleted", type: 'success' });
    dispatch({ type: ADD_TO_TODO_LIST, data })

    setIsLoading(null);
  } catch (error) {
    setIsLoading(null);
    setMessage({
      message: error?.response?.data?.message || error?.message,
      type: 'error'
    })

    if (error.response?.status === 401 || error.response?.status === 500) {
      dispatch({ type: LOGOUT });
    }
  }
}

export const addTemplate = (formData, setIsLoading, setMessage, setFormErrors) => async dispatch => {
  try {
    setIsLoading('new');

    const { data } = await api.addTemplate(formData);
    dispatch({ type: CREATE_TEMPLATE, data });

    setIsLoading(null);
  } catch (error) {
    setIsLoading(null);
    if (error?.response?.data?.errors) {
      setFormErrors(pFE => ({ ...pFE, ...error.response.data.errors }))
    } else {
      setMessage({
        message: error?.response?.data?.message || error?.message,
        type: 'error'
      })
    }

    if (error.response?.status === 401 || error.response?.status === 500) {
      dispatch({ type: LOGOUT });
    }
  }
}

export const modifyTemplate = (id, formData, setIsLoading, setMessage, setFormErrors) => async dispatch => {
  try {
    setIsLoading(id);

    const { data } = await api.modifyTemplate(id, formData);
    dispatch({ type: MODIFY_TEMPLATE, data })

    setIsLoading(null);
  } catch (error) {
    setIsLoading(null);
    if (error?.response?.data?.errors) {
      setFormErrors(pFE => ({ ...pFE, ...error.response.data.errors }))
    } else {
      setMessage({
        message: error?.response?.data?.message || error?.message,
        type: 'error'
      })
    }

    if (error.response?.status === 401 || error.response?.status === 500) {
      dispatch({ type: LOGOUT });
    }
  }
}
