import {
  GET_NOTES,
  GET_OPEND_NOTES,
  GET_NOTE,
  ADD_NOTE,
  EDIT_NOTE,
  DELETE_NOTE,
  INIT_NOTE
} from "../actions/notes";

const convertArrayToObject = (array, propName) => {
  return array.reduce((prv, cur) => Object.assign(prv, { [cur[propName]]: cur }), {});
}

const initialState = {
  notes: {},
  openedNotes: {},
}
// eslint-disable-next-line
export default (
  state = initialState,
  action
) => {
  switch (action.type) {
    case GET_OPEND_NOTES:
      return {
        ...state,
        ...action.data,
        openedNotes: convertArrayToObject(action.data.openedNotes)
      };

    case GET_NOTES:
      return {
        ...state,
        ...action.data,
        notes: convertArrayToObject(action.data.notes)
      };

    case GET_NOTE:
      state.notes[action.data._id] = action.data;

      return {
        ...state,
        ...action.data,
      }

    case INIT_NOTE:
      return {
        notes: Object.assign(state.notes, { [action.data.id]: {} }),
        openedNotes: Object.assign(state.openedNotes, { [action.data.id]: {} }),
      }

    case ADD_NOTE:
      delete state.notes[action.data.oldId];
      delete state.openedNotes[action.data.oldId];
      delete action.data.oldId;

      return {
        notes: Object.assign(state.notes, { [action.data._id]: action.data }),
        openedNotes: Object.assign(state.openedNotes, { [action.data._id]: { ...action.data, content: [] } }),
        total: state.total + 1,
        totalOpenedNotes: state.totalOpenedNotes + 1
      };

    case EDIT_NOTE:
      return {
        notes: Object.assign(state.notes, { [action.data._id]: action.data }),
        openedNotes: Object.assign(state.openedNotes, { [action.data._id]: { ...action.data, content: [] } }),
      }

    case DELETE_NOTE:
      delete state.openedNotes[action.data._id];
      delete state.notes[action.data._id];

      return {
        ...state,
        total: state.total - 1,
        totalOpenedNotes: state.totalOpenedNotes - 1
      }

    default:
      return state;
  }
};
