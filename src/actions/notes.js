import * as api from '../api/index';
import { END_LOADING, LOGOUT, START_LOADING } from './auth';

export const GET_OPEND_NOTES = 'GET_OPEND_NOTES';
export const GET_NOTES = 'GET_NOTES';

// export const INIT_NOTE = 'INIT_NOTE';
export const GET_NOTE = 'GET_NOTE';
export const ADD_NOTE = 'ADD_NOTE';
export const EDIT_NOTE = 'EDIT_NOTE';
export const DELETE_NOTE = 'DELETE_NOTE';

export const getNote = (id, setNoteData, setIsLoading, setMessage) => async dispatch => {
  try {
    setIsLoading(true);

    const { data } = await api.getStickyNote(id);

    setNoteData(data);

    dispatch({ type: GET_NOTE, data });
  } catch (error) {
    setMessage({ type: 'error', message: error?.response?.data?.message || error.message });
    if (error.response?.status === 401 || error.response?.status === 500) {
      dispatch({ type: LOGOUT });
    }
  } finally {
    setIsLoading(false);
  }
}

export const getOpenedNotes = (setMessage) => async dispatch => {
  try {
    dispatch({ type: START_LOADING, data: 'stickynotes' });

    const { data } = await api.getOpenedNotes();

    dispatch({ type: GET_OPEND_NOTES, data });
  } catch (error) {
    setMessage({ type: 'error', message: error?.response?.data?.message || error.message });
    if (error.response?.status === 401 || error.response?.status === 500) {
      dispatch({ type: LOGOUT });
    }
  } finally {
    dispatch({ type: END_LOADING, data: 'stickynotes' })
  }
}

export const getNotes = (setMessage) => async dispatch => {
  try {
    dispatch({ type: START_LOADING, data: 'stickynotes' });

    const { data } = await api.getNotes();

    dispatch({ type: GET_NOTES, data });
  } catch (error) {
    setMessage({ type: 'error', message: error?.response?.data?.message || error.message });
    if (error.response?.status === 401 || error.response?.status === 500) {
      dispatch({ type: LOGOUT });
    }
  } finally {
    dispatch({ type: END_LOADING, data: 'stickynotes' });
  }
}

export const deleteNote = (id, setIsLoading, setMessage) => async dispatch => {
  try {
    setIsLoading(true);

    const { data } = await api.deleteNote(id);

    dispatch({ type: DELETE_NOTE, data })

  } catch (error) {
    setMessage({ type: 'error', message: error?.response?.data?.message || error.message });
    if (error.response?.status === 401 || error.response?.status === 500) {
      dispatch({ type: LOGOUT });
    }
  } finally {
    setIsLoading(false);
  }
}
