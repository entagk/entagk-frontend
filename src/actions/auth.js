import * as api from './../api/index';

export const authForm = (formData, type, setError) => async dispatch => {
  try {
    if (type === 'sing in') {
      const data = await api.signIn(formData);
      
    }
  } catch (error) {
    setError(error.message);
  }
}