import { START_LOADING, END_LOADING } from "../actions/auth";
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

    case INIT_NOTE:
      state.notes.objects[action.data?.id] = action.data;
      state.notes.ids.push(action.data?.id);

      state.openedNotes.objects[action.data?.id] = action.data;
      state.openedNotes.ids.push(action.data?.id);

      return {
        ...state,
        notes: {
          objects: state.notes.objects,
          ids: state.notes.ids
        }
      }

    case ADD_NOTE:
      const newNote = action.data;

      delete state.notes.objects[newNote?.oldId];
      delete state.openedNotes.objects[newNote?.oldId];

      const notesAfterAdd = Object.assign({ [newNote._id]: newNote }, state.notes.objects);
      const openedNotesAfterAdd = Object.assign({ [newNote._id]: newNote }, state.openedNotes.objects);

      return {
        ...state,
        notes: { objects: notesAfterAdd, ids: Object.keys(notesAfterAdd) },
        openedNotes: { objects: openedNotesAfterAdd, ids: Object.keys(openedNotesAfterAdd) },
        total: state.total + 1,
        totalOpenedNotes: state.totalOpenedNotes + 1
      };

    case EDIT_NOTE:
      delete state.openedNotes.objects[action.data._id];
      delete state.notes.objects[action.data._id];

      if (action.data.open) {
        state.openedNotes.objects = Object.assign({ [action.data._id]: action.data }, state.openedNotes.objects);
      }

      state.notes.objects = Object.assign({ [action.data._id]: action.data }, state.notes.objects);

      return {
        ...state,
        notes: { objects: state.notes.objects, ids: Object.keys(state.notes.objects) },
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
