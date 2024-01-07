import * as api from '../api/index';
import { END_LOADING, LOGOUT, START_LOADING } from './auth';
import { getAll, getOne, deleteOne, clearStore } from '../utils/indexedDB/db';

export const GET_OPEND_NOTES = 'GET_OPEND_NOTES';
export const GET_NOTES = 'GET_NOTES';

export const INIT_NOTE = 'INIT_NOTE';
export const GET_NOTE = 'GET_NOTE';
export const ADD_NOTE = 'ADD_NOTE';
export const EDIT_NOTE = 'EDIT_NOTE';
export const DELETE_NOTE = 'DELETE_NOTE';
export const OPEN_NOTE = 'OPEN_NOTE';
export const CLOSE_NOTE = 'CLOSE_NOTE';
export const INITIAL_NOTES_STATE = 'INITIAL_NOTES_STATE';

export const getNote = (id, setNoteData, setIsLoading, setMessage) => async dispatch => {
  try {
    setIsLoading(true);

    if (localStorage.getItem('token')) {
      const { data } = await api.getStickyNote(id);

      setNoteData(data);

      dispatch({ type: GET_NOTE, data });
    } else {
      const data = getOne(id, 'notes');
      setNoteData(data);

      dispatch({ type: GET_NOTE, data });
    }

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
    if (!localStorage.getItem('token')) {
      const data = await getAll('notes');

      const opeendNotes = data.filter(d => d.open);
      dispatch({
        type: GET_OPEND_NOTES, data: {
          total: data.length,
          notes: opeendNotes,
          totalOpenedNotes: opeendNotes.length
        }
      });
    } else {
      dispatch({ type: START_LOADING, data: 'stickynotes' });

      const { data } = await api.getOpenedNotes();

      dispatch({ type: GET_OPEND_NOTES, data });
    }
  } catch (error) {
    setMessage({ type: 'error', message: error?.response?.data?.message || error.message });
    if (error.response?.status === 401 || error.response?.status === 500) {
      dispatch({ type: LOGOUT });
    }
  } finally {
    dispatch({ type: END_LOADING, data: 'stickynotes' })
  }
}

export const getNotes = (setMessage, page = 1) => async dispatch => {
  try {
    dispatch({ type: START_LOADING, data: 'stickynotes' });

    if (localStorage.getItem('token')) {
      const { data } = await api.getNotes(page);

      dispatch({ type: GET_NOTES, data });
    } else {
      const data = await getAll('notes');

      dispatch({
        type: GET_NOTES,
        data: {
          total: data.length,
          notes: data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).filter(d => !d.open),
          currentPage: Math.ceil(data.length / 25),
          numberOfPages: Math.ceil(data.length / 25)
        }
      });
    }
  } catch (error) {
    setMessage({ type: 'error', message: error?.response?.data?.message || error.message });
    console.error(error);
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

    if (localStorage.getItem('token')) {
      const { data } = await api.deleteNote(id);

      dispatch({ type: DELETE_NOTE, data: data.deletedId })
    } else {
      const data = await deleteOne(id, 'notes');

      dispatch({ type: DELETE_NOTE, data: data.id })
    }

  } catch (error) {
    setMessage({ type: 'error', message: error?.response?.data?.message || error.message });
    if (error.response?.status === 401 || error.response?.status === 500) {
      dispatch({ type: LOGOUT });
    }
  } finally {
    setIsLoading(false);
  }
}

export const addMultipleNotes = (setMessage) => async dispatch => {
  try {
    dispatch({ type: START_LOADING, data: 'stickynotes' });

    const notesData = await getAll('notes');

    await api.addMultipleNotes(notesData);

    dispatch({ type: INITIAL_NOTES_STATE })

    await clearStore('notes');

  } catch (error) {
    setMessage({ message: error?.response?.data?.message || error.message, type: "error" })
    console.error(error);
    if (error.response?.status === 401 || error.response?.status === 500) {
      dispatch({ type: LOGOUT });
    }
  } finally {
    dispatch({ type: END_LOADING, data: 'stickynotes' });
  }
}
