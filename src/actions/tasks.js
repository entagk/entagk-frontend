import { START_LOADING, END_LOADING } from "./auth";
import * as api from './../api';

export const GET_TASKS = "GET_TASKS";
export const NEW_TASK = "NEW_TASK";
export const CHECK_TASK = "CHECK_TASK";
export const MODIFY_TASK = "MODIFY_TASK";
export const DELETE_TASK = "DELETE_TASK";
export const CHANGE_ACTIVE_TASK = "CHANGE_ACTIVE_TASK";

export const CLEAR_FINISHED_TASKS = "CLEAR_FINISHED_TASKS";
export const CLEAR_ACT_FROM_TASKS = "CLEAR_ACT_FROM_TASKS";
export const CLEAR_ALL_TASKS = "CLEAR_ALL_TASKS";

export const getTasks = (setMessage) => async dispatch => {
  try {
    dispatch({ type: START_LOADING, data: 'tasks' });
    if (!localStorage.getItem('token')) {
      const all = JSON.parse(localStorage.getItem("tasks")) || [];
      const est = Number(localStorage.getItem("est"));
      const act = Number(localStorage.getItem("act"));

      dispatch({ type: GET_TASKS, data: { all, est, act } });
    } else {
      const { data } = await api.getAllTasks();

      dispatch({ type: GET_TASKS, data });
      console.log(data)
    }
    dispatch({ type: END_LOADING, data: 'tasks' });
  } catch (err) {
    console.error(err);
    setMessage({ message: err?.response?.data?.message || err.message, type: "error" })
  }
}

export const addNewTask = (taskData, setIsLoading, setMessage) => async dispatch => {
  try {
    // dispatch({ type: START_LOADING, data: 'tasks' });
    setIsLoading(true);
    if (!taskData.name || !taskData.est) {
      setMessage({ message: "Please enter the task name and est", error: 'error' })
    }

    if (!localStorage.getItem('token')) {
      // const newTask = Object.assign({}, { ...data, id: nanoid() })

      dispatch({ type: NEW_TASK, taskData });
    } else {
      const { data } = await api.addTask(taskData);

      dispatch({ type: NEW_TASK, data: data.newTask });
    }
    setIsLoading(false);
    // dispatch({ type: END_LOADING, data: 'tasks' });
  } catch (err) {
    setIsLoading(false);
    setMessage({ message: err?.response?.data?.message || err.message, type: "error" })
    console.error(err);
  }
}

export const checkTask = (id, setIsLoading, setMessage) => async dispatch => {
  try {
    setIsLoading(true);
    if (!id) {
      setMessage({ message: "invalid id!", type: "error" });
    }

    if (!localStorage.getItem('token')) {
      dispatch({ type: CHECK_TASK, data: id });
    } else {
      const { data } = await api.checkTask(id);

      dispatch({ type: CHECK_TASK, data });
    }

    setIsLoading(false);
  } catch (error) {
    setIsLoading(false);
    setMessage({ message: error?.response?.data?.message || error.message, type: "error" })
    console.error(error);
  }
};

export const deleteTask = (id, setIsLoading, setMessage) => async dispatch => {
  try {
    setIsLoading(true);
    if (!id) {
      setMessage({ message: "invalid task", type: "error" })
    }

    if (!localStorage.getItem('token')) {
      dispatch({ type: DELETE_TASK, data: id });
    } else {
      const { data } = await api.deleteTask(id);
      setMessage({ message: data.message, type: 'success' })
      dispatch({ type: DELETE_TASK, data: data.deleted_id });
    }
    setIsLoading(false);
  } catch (error) {
    setMessage({ message: error?.response?.data?.message || error.message, type: "error" })
    console.error(error);
  }
};

export const modifyTask = (formData, id, setIsLoading, setMessage) => async dispatch => {
  try {
    setIsLoading(true);
    if (!formData.name || !formData.est) {
      setMessage({ message: "Please enter the task name and est", type: "error" })
    }

    if (!localStorage.getItem('token')) {
      dispatch({ type: MODIFY_TASK, data: { formData, id } });
    } else {
      const { data } = await api.updateTask(formData, id);
      dispatch({ type: MODIFY_TASK, data });
    }
    setIsLoading(false);
  } catch (error) {
    setMessage({ message: error?.response?.data?.message || error.message, type: "error" })
    console.error(error);
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
    dispatch({ type: END_LOADING, data: 'tasks' })
  } catch (error) {
    setMessage({ message: error?.response?.data?.message || error.message, type: "error" })
    console.error(error);
  }
}

export const clearAct = () => async dispatch => {
  try {
    dispatch({ type: START_LOADING, data: 'tasks' })
    if (!localStorage.getItem("token")) {
      dispatch({ type: CLEAR_ACT_FROM_TASKS });
    } else {
      const {data} = await api.clearActTasks();
      dispatch({ type: CLEAR_ACT_FROM_TASKS });
    }
    dispatch({ type: END_LOADING, data: 'tasks' })
  } catch (error) {
    console.error(error);
  }
}

export const clearAllTasks = () => dispatch => {
  try {
    if (!localStorage.getItem("token")) {
      dispatch({ type: CLEAR_ALL_TASKS });
    } else {

    }
  } catch (error) {
    console.error(error);
  }
}