import * as api from './../api/index';
import { getSetting, initialSetting, modifySetting } from './timer';
import { getTasks, addMultipleTasks } from './tasks';

export const START_LOADING = 'START_LOADING';
export const END_LOADING = 'END_LOADING';
export const AUTH = 'AUTH';
export const RESET_PASSWORD = 'RESET_PASSWORD';
export const GET_USER = 'GET_USER';
export const DELETE_USER = 'DELETE_USER';
export const UPDATE_USER = 'UPDATE_USER';
export const REFRESH_TOKEN = 'REFRESH_TOKEN';

export const LOGOUT = 'LOGOUT';
export const ERROR = 'ERROR';

export const authForm = (formData, type, setMessage, navigate, setFormErrors) => async dispatch => {
  try {
    dispatch({ type: START_LOADING, data: 'auth' });
    if (type !== 'forget password') {
      const { data } = type === 'sign in' ? await api.signIn(formData) : type === 'sign up' ? await api.signUp(formData) : await api.googleLogin(formData);
      setMessage({ type: 'success', message: data.message })
      dispatch({ type: AUTH, data: { ...data } });
      dispatch(getUserData(setMessage));
      const setting = JSON.parse(localStorage.getItem('setting'));
      const tasks = JSON.parse(localStorage.getItem('tasks'));
      if (setting !== initialSetting && Boolean(setting)) {
        dispatch(modifySetting(setting, setMessage, () => { }));
      } else {
        dispatch(getSetting(setMessage));
      }

      if (tasks?.length >= 0) {
        dispatch(addMultipleTasks(tasks, setMessage, () => { }));
      }
      if (type !== 'sign up') {
        dispatch(getTasks(setMessage, 1));
      }

      navigate("/");
    } else {
      const { data } = await api.forgetPassword(formData);
      setMessage({ type: 'success', message: data.message });
    }
  } catch (error) {
    if (error?.response?.data?.errors) {
      setFormErrors(pFE => ({ ...pFE, ...error.response.data.errors }))
    } else {
      setMessage({ type: 'error', message: error?.response?.data?.message || error.message });
    }

    console.error(error);
  } finally {
    dispatch({ type: END_LOADING, data: 'auth' });
  }
}

export const refreshToken = (setMessage) => async dispatch => {
  try {
    const { data } = await api.getRefreshToken();
    dispatch({ type: REFRESH_TOKEN, data });
  } catch (error) {
    setMessage({ type: 'error', message: error?.response?.data?.message || error.message });
    if (error.response?.status === 401 || error.response?.status === 500) {
      dispatch({ type: LOGOUT });
    }
    console.error(error);
  }
}

export const getUserData = (setMessage) => async dispatch => {
  try {
    await dispatch({ type: START_LOADING, data: 'auth' });
    const { data } = await api.getUserData();
    dispatch({ type: GET_USER, data: data });
  } catch (error) {
    setMessage({ type: 'error', message: error?.response?.data?.message || error.message });
    if (error.response?.status === 401 || error.response.status === 500) {
      dispatch({ type: LOGOUT });
    }
    console.error(error);
  } finally {
    dispatch({ type: END_LOADING, data: 'auth' });
  }
}

export const deleteUser = (setMessage) => async dispatch => {
  try {

    await api.deleteUser();
    dispatch({ type: DELETE_USER });

  } catch (error) {
    setMessage({ type: 'error', message: error?.response?.data?.message || error.message });
    if (error.response?.status === 401 || error.response.status === 500) {
      dispatch({ type: LOGOUT });
    }
    console.error(error);
  }
}

export const updateUser = (formData, setFormError, setMessage, setClose) => async dispatch => {
  try {
    dispatch({ type: START_LOADING, data: 'auth' })
    const { data } = await api.updateUser(formData);
    dispatch({ type: UPDATE_USER, data: data.afterUpdatae });
    setMessage({ message: data.message, type: 'success' });
  } catch (error) {
    if (error?.response?.data?.errors) {
      setFormError(pFE => ({ ...pFE, ...error.response.data.errors }))
    } else {
      setMessage({ type: 'error', message: error?.response?.data?.message || error.message });
    }
    if (error.response?.status === 401 || error.response.status === 500) {
      dispatch({ type: LOGOUT });
    }
    console.error(error);
  } finally {
    dispatch({ type: END_LOADING, data: 'auth' })
  }
}

export const verifyResetToken = async (setMessage, setValidate, setIsLoading) => {
  try {
    setIsLoading(true);
    const { data } = await api.VerifyResetToken();

    console.log(data);

    setMessage({ message: data?.message, type: 'success' });
  } catch (error) {
    setMessage({ message: error?.response?.data?.message || error?.message, type: 'error' });
    setValidate(false);
    console.error(error);
  } finally {
    setIsLoading(false);
  }
}

export const resetPassword = async (formData, setMessage, setIsLoading) => {
  try {
    setIsLoading(true);
    const { data } = await api.resetPassword(formData);
    setMessage({ message: data.message, type: 'success' });
  } catch (error) {
    setMessage({ type: 'error', message: error?.response?.data?.message || error.message })
    console.error(error);
  } finally {
    setIsLoading(false);
  }
}
