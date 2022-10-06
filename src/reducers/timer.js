import {
  CHANGE_ACTIVE,
  PERIOD,
  SHORT,
  LONG,
  GET_SETTING,
  MODITY_SETTING,
  START_TIMER,
  STOP_TIMER
} from "../actions/timer";

// eslint-disable-next-line
export default (state = {
  active: PERIOD,
  periodNum: 0,
  setting: {},
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
}, action) => {
  switch (action.type) {
    case GET_SETTING:
      if (!localStorage.getItem("")) {
        return { ...state, setting: action.data };
      } else {
        return { ...state, }
      }
    case START_TIMER:
      return { ...state, started: true };
    case STOP_TIMER:
      return { ...state, started: false };
    case CHANGE_ACTIVE:
      let active, periodNum = state.periodNum;
      if (state.active === PERIOD) {
        periodNum++;
        active = periodNum % state.setting.longInterval === 0 ? LONG : SHORT;
      } else {
        active = PERIOD;
      }
      return { ...state, active, periodNum };
    case MODITY_SETTING:
      if (!localStorage.getItem("token")) {
        const oldSetting = state.setting;
        const newSetting = Object.assign(oldSetting, action.data);
        localStorage.setItem('setting', JSON.stringify(newSetting));
        return { ...state, setting: newSetting }
      } else {
        return { ...state, }
      }
    default:
      return state;
  }
};