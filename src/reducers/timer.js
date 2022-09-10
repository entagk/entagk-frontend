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
  periodNum: 4,
  type: "digital",
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
      return { ...state, active: action.payload }
    case INCREASE_PERIOD:
      const selectActive = state.periodNum + 1 % 4 === 0 ? "long" : "short";
      return { ...state, periodNum: state.periodNum + 1, active: selectActive };
    case START_PERIOD:
      return { ...state, active: "period" };
    default:
      return state;
  }
};