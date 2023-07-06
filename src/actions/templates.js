import { START_LOADING, END_LOADING, LOGOUT } from "./auth";
import * as api from './../api';

export const GET_TEMPLATES_FOR_USER = "GET_TEMPLATES_FOR_USER";

export const GET_TEMPLATE_TASKS = "GET_TEMPLATE_TASKS";

export const CREATE_TEMPLATE = "CREATE_TEMPLATE";

export const DELETE_TEMPLATE = "DELETE_TEMPLATE";

export const EDIT_TEMPLATE = "EDIT_TEMPLATE";

export const ADD_TO_TODO_LIST = 'ADD_TO_TODO_LIST';

export const NEW_TEMPLATE_TASK = 'NEW_TEMPLATE_TASK';

export const MODIFY_TEMPLATE_TASK = 'MODIFY_TEMPLATE_TASK';

export const DELETE_TEMPLATE_TASK = 'DELETE_TEMPLATE_TASK';

export const getTemplatesForUser = (page, setMessage) => async dispatch => {
  try {
    dispatch({ type: START_LOADING, data: 'template' });

    if (!localStorage.getItem('token')) {
      setMessage({ message: "You should be login", type: 'error' });
    } else {
      const { data } = await api.getTempsForUser(page);
      console.log(data);

      dispatch({
        type: GET_TEMPLATES_FOR_USER,
        data: data
      });
    }

    dispatch({ type: END_LOADING, data: 'template' });
  } catch (err) {
    dispatch({ type: END_LOADING, data: 'tasks' });
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
        data: {...data, id}
      });
    }

    setIsLoading(null);
  } catch (err) {
    setIsLoading(null);
    console.error(err);
    setMessage({ message: err?.response?.data?.message || err.message, type: 'error' });
  }
}

export const deleteTemplate = (id, setIsLoading, setMessage) => async dispatch => {
  try {
    setIsLoading(id);
    if (!id) {
      setMessage({ message: 'invalid template', type: 'error' })
    }

    const { data } = await api.deleteTemplate(id);
    setMessage({ message: "Successfully deleted", type: 'success' });
    dispatch({ type: DELETE_TEMPLATE, data });

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
