import * as api from './../api/index';
import { getSetting } from './timer';
import { getTasks } from './tasks';

export const START_LOADING = 'START_LOADING';
export const END_LOADING = 'END_LOADING';
export const AUTH = 'AUTH';
export const RESET_PASSWORD = 'RESET_PASSWORD';
export const GET_USER = 'GET_USER';
export const DELETE_USER = 'DELETE_USER';
export const UPDATE_USER = 'UPDATE_USER';

export const LOGOUT = 'LOGOUT';

export const authForm = (formData, type, setMessage, navigate) => async dispatch => {
  try {
    dispatch({ type: START_LOADING, data: 'auth' });
    if (type === 'sign in') {
      const { data } = await api.signIn(formData);

      setMessage({ type: 'success', message: data.message })
      dispatch({ type: AUTH, data });
      dispatch(getUserData(setMessage));
      dispatch(getSetting(setMessage));
      dispatch(getTasks(setMessage));

      navigate(-1);
    } else if (type === 'sign up') {
      const { data } = await api.signUp(formData);

      setMessage({ type: 'success', message: data.message })
      dispatch({ type: AUTH, data });
      dispatch(getUserData(setMessage))
      dispatch(getSetting(setMessage));
      dispatch(getTasks(setMessage));

      navigate(-1);
    } else if (type === 'google login') {
      const { data } = await api.googleLogin(formData);

      setMessage({ type: 'success', message: data.message })
      dispatch({ type: AUTH, data });
      dispatch(getUserData(setMessage))
      dispatch(getSetting(setMessage));
      dispatch(getTasks(setMessage));

      navigate(-1);
    } else {
      const { data } = await api.forgetPassword(formData);
      setMessage({ type: 'success', message: data.message });
    }
    dispatch({ type: END_LOADING, data: 'auth' });
  } catch (error) {
    setMessage({ type: 'error', message: error?.response?.data?.message || error.message })
    dispatch({ type: END_LOADING, data: 'auth' });
    console.error(error);
  }
}

export const getUserData = (setMessage) => async dispatch => {
  try {
    await dispatch({ type: START_LOADING, data: 'auth' });
    const { data } = await api.getUserData();
    dispatch({ type: GET_USER, data: data });
    await dispatch({ type: END_LOADING, data: 'auth' });
  } catch (error) {
    setMessage({ type: 'error', message: error?.response?.data?.message || error.message })
    console.error(error);
  }
}

export const deleteUser = (setMessage) => async dispatch => {
  try {

    await api.deleteUser();
    dispatch({ type: DELETE_USER });

  } catch (error) {
    setMessage({ type: 'error', message: error?.response?.data?.message || error.message })
    console.error(error);
  }
}

export const updateUser = (formData, setMessage) => async dispatch => {
  try {
    dispatch({ type: START_LOADING, data: 'auth' })
    const { data } = await api.updateUser(formData);
    dispatch({ type: UPDATE_USER, data: data.afterUpdatae });
    dispatch({ type: END_LOADING, data: 'auth' })
  } catch (error) {
    setMessage({ type: 'error', message: error?.response?.data?.message || error.message })
    console.error(error);
  }
}

export const verifyResetToken = async (setMessage, setValidate, setIsLoading) => {
  try {
    setIsLoading(true);
    const { data } = await api.VerifyResetToken();

    console.log(data);

    setMessage({ message: data?.message, type: 'success' });
    setIsLoading(false);
  } catch (error) {
    setIsLoading(false);
    setMessage({ message: error?.response?.data?.message || error?.message, type: 'error' });
    setValidate(false);
    console.error(error);
  }
}

export const resetPassword = async (formData, setMessage, setIsLoading) => {
  try {
    setIsLoading(true);
    const { data } = await api.resetPassword(formData);
    setMessage({ message: data.message, type: 'success' });
    setIsLoading(false);
  } catch (error) {
    setIsLoading(false);
    setMessage({ type: 'error', message: error?.response?.data?.message || error.message })
    console.error(error);
  }
}