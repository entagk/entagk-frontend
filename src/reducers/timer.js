import {
  CHANGE_ACTIVE,
  PERIOD,
  SHORT, 
  LONG
} from "../actions/timer";

// eslint-disable-next-line
export default (state = {
  active: PERIOD,
  periodNum: 0,
  type: "analog",
  periodInterval: 4,
  activites: {
    [PERIOD]: {
      name: PERIOD,
      time: 1,
      color: "#ff002f",
      timerBorder: "#b40021"
    },
    [SHORT]: {
      name: SHORT,
      time: 1,
      color: "#00e3ff",
      timerBorder: "#16a9bb"
    },
    [LONG]: {
      name: LONG,
      time: 3,
      color: "#36a7ff",
      timerBorder: "#3185c7"
    }
  }
}, action) => {
  switch (action.type) {
    case CHANGE_ACTIVE:
      let active, periodNum = state.periodNum;
      if (state.active === PERIOD) {
        periodNum++;
        active = periodNum % state.periodInterval === 0 ? LONG : SHORT;
      } else {
        active = PERIOD;
      }
      return { ...state, active, periodNum };
    default:
      return state;
  }
};