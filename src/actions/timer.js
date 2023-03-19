import { END_LOADING, LOGOUT, START_LOADING } from "./auth";
import * as api from './../api';

export const CHANGE_ACTIVE = "CHANGE_ACTIVE";
export const INCREASE_ACT = "INCREASE_ACT";

export const START_TIMER = "START_TIMER";
export const STOP_TIMER = "STOP_TIMER";

export const PERIOD = "PERIOD";
export const SHORT = "SHORT";
export const LONG = "LONG";

export const GET_SETTING = "GET_SETTING";
export const MODITY_SETTING = "MODITY_SETTING";

export const alarmSounds = [
  {
    name: "alarm 1",
    src: 'sounds/alarm/1.mp3'
  },
  {
    name: "alarm 2",
    src: 'sounds/alarm/2.mp3'
  },
  {
    name: "alarm 3",
    src: 'sounds/alarm/3.mp3'
  },
  {
    name: "alarm 4",
    src: 'sounds/alarm/4.mp3'
  },
  {
    name: "alarm 5",
    src: 'sounds/alarm/5.mp3'
  },
  {
    name: "alarm 6",
    src: 'sounds/alarm/6.mp3'
  },
  {
    name: "alarm 7",
    src: 'sounds/alarm/7.mp3'
  },
  {
    name: "alarm 8",
    src: 'sounds/alarm/8.mp3'
  },
  {
    name: "Analog",
    src: 'sounds/alarm/Analog.mp3'
  },
  {
    name: "bell ringing",
    src: 'sounds/alarm/bell-ringing.mp3'
  },
];

export const tickingSounds = [
  { name: "none" },
  {
    name: "tricking 1",
    src: "sounds/tricking/1.mp3"
  },
  {
    name: "tricking 2",
    src: "sounds/tricking/2.mp3"
  },
  {
    name: "tricking 3",
    src: "sounds/tricking/3.mp3"
  },
  {
    name: "tricking 4",
    src: "sounds/tricking/4.mp3"
  },
  {
    name: "tricking 5",
    src: "sounds/tricking/5.mp3"
  },
  {
    name: "tricking 6",
    src: "sounds/tricking/6.mp3"
  },
  {
    name: "tricking 7",
    src: "sounds/tricking/7.mp3"
  },
  {
    name: "tricking 8",
    src: "sounds/tricking/8.mp3"
  },
  {
    name: "tricking 9",
    src: "sounds/tricking/9.mp3"
  },
  {
    name: "tricking 10",
    src: "sounds/tricking/10.mp3"
  }
];

export const clickSounds = [
  { name: "none" },
  {
    name: "can opening pop",
    src: "sounds/click/can-opening-pop-101856.mp3"
  },
  {
    name: "click 1",
    src: "sounds/click/click-1.mp3"
  },
  {
    name: "click 2",
    src: "sounds/click/click-2.mp3"
  },
  {
    name: "click 3",
    src: "sounds/click/click-3.mp3"
  },
  {
    name: "clickswitch",
    src: "sounds/click/clickswitch-03-104090.mp3"
  },
  {
    name: "clip in",
    src: "sounds/click/clip-in.mp3"
  },
  {
    name: "flashlight clicking on",
    src: "sounds/click/flashlight-clicking-on-105809.mp3"
  },
  {
    name: "lego piece pressed",
    src: "sounds/click/lego-piece-pressed-105360.mp3"
  },
  {
    name: "light switch",
    src: "sounds/click/light-switch-81967.mp3"
  },
  {
    name: "logitech",
    src: "sounds/click/logitech-computer-mouse-click-95725.mp3"
  },
];

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
  alarmType: alarmSounds[0],
  alarmVolume: 50,
  alarmRepet: false,
  tickingType: tickingSounds[1],
  tickingVolume: 50,
  clickType: clickSounds[1],
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
    // setTime()
    setIsLoading(activeId);
    if (!localStorage.getItem('token')) {
      dispatch({ type: CHANGE_ACTIVE });
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
    setIsLoading(null);
  } catch (error) {
    console.error(error);
    setMessage({ message: error.response.data.message || error.message, type: 'error' });
    if (error.response?.status === 401 || error.response?.status === 500) {
      dispatch({ type: LOGOUT });
    }
  }
}

export const modifySetting = (formData, setMessage) => async dispatch => {
  try {
    dispatch({ type: START_LOADING, data: 'setting' });
    if (!localStorage.getItem("token")) {
      dispatch({ type: MODITY_SETTING, data: formData });
    } else {
      const { data } = await api.updateSetting(formData);
      dispatch({ type: MODITY_SETTING, data });
    }
    dispatch({ type: END_LOADING, data: 'setting' });
  } catch (error) {
    dispatch({ type: END_LOADING, data: 'setting' });
    console.error(error);
    setMessage({ message: error.response.data.message || error.message, type: 'error' });
    if (error.response?.status === 401 || error.response?.status === 500) {
      dispatch({ type: LOGOUT });
    }
  }
}
