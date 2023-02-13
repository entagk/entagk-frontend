import { LOGOUT, START_LOADING, END_LOADING, DELETE_USER } from "../actions/auth";
import {
  CHANGE_ACTIVE,
  PERIOD,
  SHORT,
  LONG,
  GET_SETTING,
  MODITY_SETTING,
  START_TIMER,
  STOP_TIMER,
  initialSetting
} from "../actions/timer";

// eslint-disable-next-line
export default (state = {
  active: localStorage.getItem("active") || PERIOD,
  periodNum: 0,
  setting: undefined,
  started: false,
  activites: {
    [PERIOD]: {
      name: PERIOD,
      color: "#ff002f",
      timerBorder: "#b40021"
    },
    [SHORT]: {
      name: SHORT,
      color: "#00e3ff",
      timerBorder: "#16a9bb"
    },
    [LONG]: {
      name: LONG,
      color: "#36a7ff",
      timerBorder: "#3185c7"
    }
  },
  restOfTime: 0,
  isLoading: false
}, action) => {
  switch (action.type) {
    case START_LOADING:
      return { ...state, isLoading: action.data === 'setting' ? true : state.isLoading }
    case END_LOADING:
      return { ...state, isLoading: action.data === 'setting' ? false : state.isLoading }

    case GET_SETTING:
      return { ...state, setting: action.data };

    case START_TIMER:
      console.log(state.restOfTime, state.active);
      localStorage.setItem('restOfTime', action.data);
      return { ...state, started: true, restOfTime: action.data };

    case STOP_TIMER:
      localStorage.setItem('restOfTime', action.data);
      return { ...state, started: false, restOfTime: action.data };

    case CHANGE_ACTIVE:
      let active, periodNum = state.periodNum;
      if (state.active === PERIOD) {
        periodNum++;
        active = periodNum % state.setting.longInterval === 0 ? LONG : SHORT;
      } else {
        active = PERIOD;
      }
      localStorage.setItem('active', active);
      localStorage.setItem("restOfTime", 0);
      document.documentElement.style.setProperty('--main-color', state.activites[active].color);
      document.documentElement.style.setProperty('--secondary-color', state.activites[active].timerBorder);

      return { ...state, active, periodNum };

    case MODITY_SETTING:
      if (!localStorage.getItem("token")) {
        const oldSetting = state.setting;
        const newSetting = Object.assign(oldSetting, action.data);
        localStorage.setItem('setting', JSON.stringify(newSetting));
        return { ...state, setting: newSetting }
      } else {
        const oldSetting = state.setting;
        const newSetting = Object.assign(oldSetting, action.data);
        return { ...state, setting: newSetting }
      }

    case LOGOUT:
    case DELETE_USER:
      return { ...state, setting: initialSetting };
    default:
      return state;
  }
};
