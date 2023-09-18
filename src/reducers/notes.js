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
  const ids = [];
  const obj = array.reduce((prv, cur) => {
    ids.push(cur[propName]);
    return Object.assign(prv, { [cur[propName]]: cur })
  }, {});
  return { ids, objects: obj }
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
      state.notes.objects[action.data._id] = action.data;

      return {
        ...state,
      }

    case ADD_NOTE:
      return {
        ...state,
        notes: { objects: Object.assign(state.notes.objects, { [action.data._id]: action.data }), ids: state.notes.ids },
        openedNotes: { objects: Object.assign(state.openedNotes.objects, { [action.data._id]: action.data }), ids: state.openedNotes.ids },
        total: state.total + 1,
        totalOpenedNotes: state.totalOpenedNotes + 1
      };

    case EDIT_NOTE:
      if (action.data.open) {
        state.openedNotes.objects[action.data._id] = action.data;
      } else {
        delete state.openedNotes.objects[action.data._id];
        state.totalOpenedNotes = state?.totalOpenedNotes - 1;
      }

      let openedNotesObjs = Object.assign(state.notes.objects, { [action.data._id]: action.data });

      return {
        ...state,
        notes: { objects: openedNotesObjs, ids: Object.keys(openedNotesObjs) },
        openedNotes: { objects: state.openedNotes?.objects, ids: Object.keys(state?.openedNotes?.objects) }
      }

    case DELETE_NOTE:
      delete state.openedNotes.objects[action.data];
      state.openedNotes.ids = state.openedNotes?.ids?.filter(n => n !== action.data);
      delete state.notes.objects[action.data];
      state.notes.ids = state.notes?.ids?.filter(n => n !== action.data);

      return {
        ...state,
        total: state.total - 1,
        totalOpenedNotes: state.totalOpenedNotes - 1
      };

    default:
      return state;
  }
};
