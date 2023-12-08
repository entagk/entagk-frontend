import { END_LOADING, LOGOUT, START_LOADING } from "./auth";
import * as api from './../api';
import { updateOne, getOne } from "../utils/indexedDB/db";

export const CHANGE_ACTIVE = "CHANGE_ACTIVE";
export const INCREASE_ACT = "INCREASE_ACT";

export const START_TIMER = "START_TIMER";
export const STOP_TIMER = "STOP_TIMER";

export const PERIOD = "PERIOD";
export const SHORT = "SHORT";
export const LONG = "LONG";

export const GET_SETTING = "GET_SETTING";
export const MODITY_SETTING = "MODITY_SETTING";

export const GET_SOUNDS = "GET_SOUNDS";

export const CHANGE_TO_TEMPLATE_SETTING = 'CHANGE_TO_TEMPLATE_SETTING';

export const initialSetting = {
  format: 'analog',
  time: {
    [PERIOD]: 1500,
    [SHORT]: 300,
    [LONG]: 900,
  },
  autoBreaks: false,
  autoPomodors: false,
  autoStartNextTask: false,
  longInterval: 4,
  alarmType: {
    "name": "alarm 1",
    "src": "https://res.cloudinary.com/da47rmq7c/video/upload/v1699991843/audio/alarm/general/alarm_1.mp3"
  },
  alarmVolume: 50,
  alarmRepet: 0,
  tickingType: {
    "name": "click 1",
    "src": "https://res.cloudinary.com/da47rmq7c/video/upload/v1699993234/audio/click/general/click_1.mp3"
  },
  tickingVolume: 50,
  clickType: {
    "name": "ticking low",
    "src": "https://res.cloudinary.com/da47rmq7c/video/upload/v1699994018/audio/ticking/general/ticking_low.mp3"
  },
  clickVolume: 50,
  focusMode: false,
  notificationType: "last",
  notificationInterval: 1,
};

export const getSetting = (setMessage, setError) => async dispatch => {
  try {
    dispatch({ type: START_LOADING, data: 'setting' });
    if (!localStorage.getItem('token')) {
      dispatch({ type: GET_SETTING, data: JSON.parse(localStorage.getItem('setting')) || initialSetting });
    } else {
      const { data } = await api.getAllSetting();

      dispatch({ type: GET_SETTING, data: data });
    }
    dispatch({ type: END_LOADING, data: 'setting' });
  } catch (error) {
    // const errorMessage = await error.response; 
    if (error.response?.status === 401 || error.response?.status === 500) {
      dispatch({ type: LOGOUT });
    }
    console.error(error);
    setMessage({ message: error?.response?.data?.message || error.message, type: 'error' });
  }
}

export const changeActive = (active, activeId, setIsLoading, setMessage) => async dispatch => {
  try {
    setIsLoading(activeId);
    console.log(active, activeId);
    if (!localStorage.getItem('token')) {
      dispatch({ type: CHANGE_ACTIVE });
      if (activeId && active === PERIOD) {
        const task = await getOne(activeId, 'tasks');

        await updateOne({ ...task, act: task.act + 1 }, 'tasks');
      }

      dispatch({ type: INCREASE_ACT, data: active });
    } else {
      if (active === PERIOD && activeId) {
        dispatch({ type: CHANGE_ACTIVE });
        const { data } = await api.increaseAct(activeId);
        dispatch({ type: INCREASE_ACT, data: { active, task: data } });
      } else {
        dispatch({ type: CHANGE_ACTIVE })
      }
    }
  } catch (error) {
    console.error(error);
    setMessage({ message: error.response.data.message || error.message, type: 'error' });
    if (error.response?.status === 401 || error.response?.status === 500) {
      dispatch({ type: LOGOUT });
    }
  } finally {
    setIsLoading(null);
  }
}

export const modifySetting = (formData, setMessage, setFormErrors) => async dispatch => {
  try {
    dispatch({ type: START_LOADING, data: 'setting' });
    if (!localStorage.getItem("token")) {
      dispatch({ type: MODITY_SETTING, data: formData });
    } else {
      const { data } = await api.updateSetting(formData);
      dispatch({ type: MODITY_SETTING, data });
    }
  } catch (error) {
    console.error(error);
    setMessage({ message: error.response.data.message || error.message, type: 'error' });
    if (error.response?.status === 401 || error.response?.status === 500) {
      dispatch({ type: LOGOUT });
    }
  } finally {
    dispatch({ type: END_LOADING, data: 'setting' });
  }
}

export const getGeneralSounds = (type, setIsLoading, setMessage) => async dispatch => {
  try {
    setIsLoading(true);

    const { data } = await api.getGeneralSounds(type);

    dispatch({
      type: GET_SOUNDS,
      data: {
        type,
        data: {
          total: data.total,
          files: data.files.map(f => ({ name: f.name.toLowerCase().replaceAll('_', " ").replaceAll('-', " "), src: f.src })).sort((a, b) => a.name - b.name)
        }
      }
    });
  } catch (error) {
    console.error(error);
    setMessage({ message: error.response.data.message || error.message, type: 'error' });
  } finally {
    setIsLoading(false);
  }
}
