export const GET_TASKS = "GET_TASKS";
export const NEW_TASK = "NEW_TASK";
export const CHECK_TASK = "CHECK_TASK";
export const MODIFY_TASK = "MODIFY_TASK";
export const DELETE_TASK = "DELETE_TASK";
export const CHANGE_ACTIVE_TASK = "CHANGE_ACTIVE_TASK";

export const CLEAR_FINISHED_TASKS = "CLEAR_FINISHED_TASKS";
export const CLEAR_ACT_FROM_TASKS = "CLEAR_ACT_FROM_TASKS";
export const CLEAR_ALL_TASKS = "CLEAR_ALL_TASKS";

export const getTasks = (setError) => dispatch => {
  try {
    if (!localStorage.getItem('token')) {
      const all = JSON.parse(localStorage.getItem("tasks")) || [];
      const est = Number(localStorage.getItem("est"));
      const act = Number(localStorage.getItem("act"));

      dispatch({ type: GET_TASKS, data: { all, est, act } });
    } else {

    }
  } catch (err) {
    console.error(err);
    setError(err.message)
  }
}

export const addNewTask = (data, setError) => dispatch => {
  try {
    if (!data.name || !data.est) {
      setError("Please enter the task name and est")
    }

    if (!localStorage.getItem('token')) {
      // const newTask = Object.assign({}, { ...data, id: nanoid() })

      dispatch({ type: NEW_TASK, data });
    } else {

    }
  } catch (err) {
    setError(err.message);
    console.error(err);
  }
}

export const checkTask = (id, setError) => dispatch => {
  try {
    if (!id) {
      setError("invalid id!");
    }

    if (!localStorage.getItem('token')) {
      dispatch({ type: CHECK_TASK, data: id });
    } else {

    }

  } catch (error) {
    setError(error.message);
    console.error(error);
  }
};

export const deleteTask = (id, setError) => dispatch => {
  try {
    if (!id) {
      setError("invalid task");
    }

    if (!localStorage.getItem('token')) {
      dispatch({ type: DELETE_TASK, data: id });
    } else {

    }
  } catch (error) {
    setError(error.message);
    console.error(error);
  }
};

export const modifyTask = (data, setError) => dispatch => {
  try {
    if (!data.name || !data.est) {
      setError("Please enter the task name and est")
    }

    if (!localStorage.getItem('token')) {
      dispatch({ type: MODIFY_TASK, data: data });
    } else {

    }
  } catch (error) {
    setError(error.message);
    console.error(error);
  }
}

export const clearFinishedTasks = () => dispatch => {
  try {
    if (!localStorage.getItem("token")) {
      dispatch({ type: CLEAR_FINISHED_TASKS });
    } else {

    }
  } catch (error) {
    console.error(error);
  }
}

export const clearAct = () => dispatch => {
  try {
    if (!localStorage.getItem("token")) {
      dispatch({ type: CLEAR_ACT_FROM_TASKS });
    } else {

    }
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