import * as api from '../api/index';
import { START_LOADING, END_LOADING } from './auth';

export const GET_LEADERBOARD = 'GET_LEADERBOARD';

export const getLeaderboard = (page, setMessage) => async dispatch => {
  try {
    dispatch({ type: START_LOADING, data: 'leaderboard' });

    const { data } = await api.getLeaderboard(page);

    dispatch({ type: GET_LEADERBOARD, data });
  } catch (error) {
    setMessage({ type: 'error', message: error?.response?.data?.message || error.message });

    console.error(error);
  } finally {
    dispatch({ type: END_LOADING, data: 'leaderboard' });
  }
} 
