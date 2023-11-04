import { START_LOADING, END_LOADING, LOGOUT } from "./auth";
import { addNew, clearStore, deleteOne, getAll, updateOne } from './db';
import {
  NEW_TEMPLATE_TASK,
  MODIFY_TEMPLATE_TASK,
  DELETE_TEMPLATE_TASK
} from './templates';
import * as api from './../api';

export const GET_TASKS = "GET_TASKS";
export const NEW_TASK = "NEW_TASK";
export const ADD_LOCAL_TASKS = "ADD_LOCAL_TASKS";
export const CHECK_TASK = "CHECK_TASK";
export const MODIFY_TASK = "MODIFY_TASK";
export const DELETE_TASK = "DELETE_TASK";
export const CHANGE_ACTIVE_TASK = "CHANGE_ACTIVE_TASK";

export const GET_TEMPLATE_TASKS = "GET_TEMPLATE_TASKS";

export const CLEAR_FINISHED_TASKS = "CLEAR_FINISHED_TASKS";
export const CLEAR_ACT_FROM_TASKS = "CLEAR_ACT_FROM_TASKS";
export const CLEAR_ALL_TASKS = "CLEAR_ALL_TASKS";

export const CLEAR_CONGRATS = "CLEAR_CONGRATS";

const initialData = {
  name: "",
  est: 1,
  act: 0,
  notes: "",
  project: "",
  check: false,
};

export const getTasks = (setMessage, page) => async dispatch => {
  try {
    dispatch({ type: START_LOADING, data: 'tasks' });
    console.log(page);
    if (!localStorage.getItem('token')) {
      const all = await getAll('tasks');

      console.log(all);

      dispatch({
        type: GET_TASKS,
        data: {
          all,
          est: all.reduce((prev, t) => prev + t.est, 0),
          act: all.reduce((prev, t) => prev + t.act, 0)
        }
      })
    } else {
      const { data } = await api.getAllTasks(page);

      dispatch({
        type: GET_TASKS,
        data: {
          all: data.tasks,
          currentPage: data.currentPage,
          numberOfPages: data.numberOfPages,
          total: data.total,
        }
      });
    }
  } catch (err) {
    console.error(err);
    setMessage({ message: err?.response?.data?.message || err.message, type: 'error' });

    if (err.response?.status === 401 || err.response?.status === 500) {
      dispatch({ type: LOGOUT });
    }
  } finally {
    dispatch({ type: END_LOADING, data: 'tasks' });
  }
}

export const addNewTask = (taskData, setIsLoading, setMessage, setFormErrors) => async dispatch => {
  try {
    setIsLoading('new');
    if (!taskData.name || !taskData.est) {
      setMessage({ message: "Please enter the task name and est", error: 'error' })
    }

    if (!localStorage.getItem('token')) {
      const data = await addNew("tasks", { ...initialData, ...taskData })

      dispatch({ type: NEW_TASK, data });
    } else {
      const { data } = await api.addTask(taskData);

      if (data.template && !data.template?.todo) {
        dispatch({ type: NEW_TEMPLATE_TASK, data: data });
      } else {
        dispatch({ type: NEW_TASK, data: data });
      }
    }
  } catch (err) {
    if (err?.response?.data?.errors) {
      setFormErrors(pFE => ({ ...pFE, ...err.response.data.errors }))
    } else {
      setMessage({ message: err?.response?.data?.message || err.message, type: "error" })
    }
    console.error(err);
    if (err.response?.status === 401 || err.response.status === 500) {
      dispatch({ type: LOGOUT });
    }
  } finally {
    setIsLoading(null);
  }
}

export const addMultipleTasks = (setMessage, setFormErrors) => async dispatch => {
  try {
    dispatch({ type: START_LOADING, data: 'tasks' });

    const tasksData = await getAll('tasks');
    const { data } = await api.addMultipleTasks(tasksData);

    await clearStore('tasks');
    dispatch({ type: ADD_LOCAL_TASKS });

  } catch (error) {
    if (error?.response?.data?.errors) {
      setFormErrors(pFE => ({ ...pFE, ...error.response.data.errors }));
    } else {
      setMessage({ type: 'error', message: error?.response?.data?.message || error.message });
    }
    setMessage({ message: error?.response?.data?.message || error.message, type: "error" })
    console.error(error);
    if (error.response?.status === 401 || error.response?.status === 500) {
      dispatch({ type: LOGOUT });
    }
  } finally {
    dispatch({ type: END_LOADING, data: 'tasks' });
  }
}

export const checkTask = (task, setIsLoading, setMessage) => async dispatch => {
  try {
    setIsLoading(task._id);
    if (!task._id) {
      setMessage({ message: "invalid id!", type: "error" });
    }

    if (!localStorage.getItem('token')) {
      const data = await updateOne({ ...task, check: !task.check, act: task.check ? 0 : task.est }, 'tasks');

      dispatch({ type: CHECK_TASK, data: data._id });
    } else {
      const { data } = await api.checkTask(task._id);

      dispatch({ type: CHECK_TASK, data: data });
    }

  } catch (error) {
    setMessage({ message: error?.response?.data?.message || error.message, type: "error" })
    console.error(error);
    if (error.response?.status === 401 || error.response?.status === 500) {
      dispatch({ type: LOGOUT });
    }
  } finally {
    setIsLoading(null);
  }
};

export const deleteTask = (id, template, setIsLoading, setMessage, setActiveTemplate, tempTasks) => async dispatch => {
  try {
    setIsLoading(id);
    if (!id) {
      setMessage({ message: "invalid task", type: "error" })
    }

    if (!localStorage.getItem('token')) {
      const data = await deleteOne(id, 'tasks');

      dispatch({ type: DELETE_TASK, data: { id: data.id } });
    } else {
      const { data } = await api.deleteTask(id);
      setMessage({ message: data.message, type: 'success' });

      if (template && !template?.todo) {
        dispatch({ type: DELETE_TEMPLATE_TASK, data: { id: data.deleted_id, template } });
      } else {
        dispatch({ type: DELETE_TASK, data: { id: data.deleted_id, template } });
        if (tempTasks.length === 1)
          setActiveTemplate(null);
      }
    }
  } catch (error) {
    setMessage({ message: error?.response?.data?.message || error.message, type: "error" })
    console.error(error);
    if (error.response?.status === 401 || error.response.status === 500) {
      dispatch({ type: LOGOUT });
    }
  } finally {
    setIsLoading(null);
  }
};

export const modifyTask = (formData, id, setIsLoading, setMessage, setFormErrors) => async dispatch => {
  try {
    setIsLoading(id);
    if (!formData.name || !formData.est) {
      setMessage({ message: "Please enter the task name and est", type: "error" })
    }

    if (!localStorage.getItem('token')) {
      const data = await updateOne({ ...formData, _id: id, check: formData.est === formData.act }, 'tasks');

      dispatch({ type: MODIFY_TASK, data });
    } else {
      const { data } = await api.updateTask(formData, id);
      if (data.template && !data.template?.todo) {
        dispatch({ type: MODIFY_TEMPLATE_TASK, data: data });
      } else {
        dispatch({ type: MODIFY_TASK, data: data });
      }
    }
  } catch (error) {
    if (error?.response?.data?.errors) {
      setFormErrors(pFE => ({ ...pFE, ...error.response.data.errors }));
    } else {
      setMessage({ type: 'error', message: error?.response?.data?.message || error.message });
    }
    if (error.response?.status === 401 || error.response.status === 500) {
      dispatch({ type: LOGOUT });
    }
  } finally {
    setIsLoading(null);
  }
}

export const getTodoTasks = (id, page, setLoadingTasks, setMessage) => async dispatch => {
  try {
    setLoadingTasks(true);

    const { data } = await api.getTasksForTodoTemp(id, page);
    dispatch({ type: GET_TEMPLATE_TASKS, data: { id, ...data } })
  } catch (error) {
    setMessage({ message: error?.response?.data?.message || error.message, type: "error" })
    console.error(error);
    if (error.response?.status === 401 || error.response.status === 500) {
      dispatch({ type: LOGOUT });
    }
  } finally {
    setLoadingTasks(false);
  }
}

export const clearFinishedTasks = (setMessage) => async dispatch => {
  try {
    dispatch({ type: START_LOADING, data: 'tasks' })
    if (!localStorage.getItem("token")) {
      dispatch({ type: CLEAR_FINISHED_TASKS });
      setMessage({ type: 'success', message: "Success deleting." })
    } else {
      const { data } = await api.clearFinishedTasks();

      dispatch({ type: CLEAR_FINISHED_TASKS });

      setMessage({ type: 'success', message: data.message })
    }
  } catch (error) {
    setMessage({ message: error?.response?.data?.message || error.message, type: "error" })
    console.error(error);
    if (error.response?.status === 401 || error.response.status === 500) {
      dispatch({ type: LOGOUT });
    }
  } finally {
    dispatch({ type: END_LOADING, data: 'tasks' })
  }
}

export const clearAct = (setMessage) => async dispatch => {
  try {
    dispatch({ type: START_LOADING, data: 'tasks' })
    if (!localStorage.getItem("token")) {
      dispatch({ type: CLEAR_ACT_FROM_TASKS });
    } else {
      const { data } = await api.clearActTasks();
      dispatch({ type: CLEAR_ACT_FROM_TASKS, data });
    }
  } catch (error) {
    setMessage({ message: error?.response?.data?.message || error.message, type: "error" });
    console.error(error);
    if (error.response?.status === 401 || error.response.status === 500) {
      dispatch({ type: LOGOUT });
    }
  } finally {
    dispatch({ type: END_LOADING, data: 'tasks' })
  }
}

export const clearAllTasks = (setMessage) => async dispatch => {
  try {
    dispatch({ type: START_LOADING, data: 'tasks' })
    if (!localStorage.getItem("token")) {
      await clearStore('tasks');
      dispatch({ type: CLEAR_ALL_TASKS });
    } else {
      const { data } = await api.clearAllTasks();

      dispatch({ type: CLEAR_ALL_TASKS });

      setMessage({ type: 'success', message: data.message })
    }
  } catch (error) {
    setMessage({ message: error?.response?.data?.message || error.message, type: "error" })
    console.error(error);
    if (error.response?.status === 401 || error.response.status === 500) {
      dispatch({ type: LOGOUT });
    }
  } finally {
    dispatch({ type: END_LOADING, data: 'tasks' });
  }
}
