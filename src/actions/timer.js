export const INCREASE_PERIOD = "INCREASE_PERIOD";
export const START_PERIOD = "START_PERIOD";

export const CHANGE_ACTIVE = "CHANGE_ACTIVE";

export const PERIOD = "PERIOD";
export const SHORT = "SHORT";
export const LONG = "LONG";

export const INCREASE_ROUND = "INCREASE_ROUND";

export const changeActive = (active) => async dispatch => {
  try {
    dispatch({ type: CHANGE_ACTIVE, data: active });
  } catch (error) {
    console.error(error)
  }
}

export const incrementRound = () => dispatch => {
  try {
    dispatch({ type: INCREASE_ROUND });
  } catch (error) {
    console.log(error);
  }
}

export const finishPeriod = () => async dispatch => {
  try {
    await dispatch({ type: INCREASE_PERIOD });
  } catch (error) {
    console.error(error.message);
  }
}

// export const startPeriod = () => async (dispatch) => {
//   try {
//     await dispatch({ type: START_PERIOD });
//   } catch (error) {
//     console.error(error.message);
//   }
// }