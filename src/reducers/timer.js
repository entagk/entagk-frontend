import {
  INCREASE_PERIOD,
  CHANGE_ACTIVE,
  START_PERIOD,
  PERIOD,
  SHORT, LONG
} from "../actions/timer";

// eslint-disable-next-line
export default (state = {
  active: PERIOD,
  periodNum: 0,
  type: "analog",
  periodInterval: 2,
  activites: {
    [PERIOD]: {
      name: PERIOD,
      time: 25
    },
    [SHORT]: {
      name: SHORT,
      time: 5
    },
    [LONG]: {
      name: LONG,
      time: 15
    }
  }
}, action) => {
  switch (action.type) {
    case CHANGE_ACTIVE:
      let active, periodNum = state.periodNum;
      if(state.active === PERIOD) {
        periodNum++;
        active = periodNum % state.periodInterval === 0 ? LONG : SHORT;
      }else {
        active = PERIOD;
      }
      return { ...state, active, periodNum };
    case INCREASE_PERIOD:
      return { ...state, periodNum: state.periodNum + 1 };
    case START_PERIOD:
      return { ...state, active: PERIOD };
    default:
      return state;
  }
};