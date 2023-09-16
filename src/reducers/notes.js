import { START_LOADING, END_LOADING } from "../actions/auth";
import {
  GET_NOTES,
  GET_OPEND_NOTES,
  GET_NOTE,
  ADD_NOTE,
  EDIT_NOTE,
  DELETE_NOTE,
  // INIT_NOTE
} from "../actions/notes";

const convertArrayToObject = (array, propName) => {
  return array.reduce((prv, cur) => Object.assign(prv, { [cur[propName]]: cur }), {});
}

const initialState = {
  notes: {},
  openedNotes: {},
  isLoading: false
}
// eslint-disable-next-line
export default (
  state = initialState,
  action
) => {
  switch (action.type) {
    case START_LOADING:
      return { ...state, isLoading: action.data === 'stickynotes' ? true : state.isLoading };

    case END_LOADING:
      return { ...state, isLoading: action.data === 'stickynotes' ? false : state.isLoading };

    case GET_OPEND_NOTES:
      return {
        ...state,
        ...action.data,
        openedNotes: convertArrayToObject(action.data.notes, '_id'),
        notes: convertArrayToObject(action.data.notes, '_id'),
      };

    case GET_NOTES:
      return {
        ...state,
        ...action.data,
        notes: convertArrayToObject(action.data.notes, '_id')
      };

    case GET_NOTE:
      state.notes[action.data._id] = action.data;

      return {
        ...state,
      }

    // case INIT_NOTE:
    //   return {
    //     ...state,
    //     notes: Object.assign(state.notes, { [action.data.id]: {} }),
    //     openedNotes: Object.assign(state.openedNotes, { [action.data.id]: {} }),
    //   }

    case ADD_NOTE:
      delete state.notes[action.data.oldId];
      delete state.openedNotes[action.data.oldId];
      delete action.data.oldId;

      return {
        ...state,
        notes: Object.assign(state.notes, { [action.data._id]: action.data }),
        openedNotes: Object.assign(state.openedNotes, { [action.data._id]: { ...action.data, content: [] } }),
        total: state.total + 1,
        totalOpenedNotes: state.totalOpenedNotes + 1
      };

    case EDIT_NOTE:
      if (action.data.open) {
        state.openedNotes[action.data._id] = action.data;
      } else {
        delete state.openedNotes[action.data._id];
        state.totalOpenedNotes = state?.totalOpenedNotes - 1;
      }

      return {
        ...state,
        notes: Object.assign(state.notes, { [action.data._id]: action.data }),
      }

    case DELETE_NOTE:
      delete state.openedNotes[action.data._id];
      delete state.notes[action.data._id];

      return {
        ...state,
        total: state.total - 1,
        totalOpenedNotes: state.totalOpenedNotes - 1
      };

    default:
      return state;
  }
};
