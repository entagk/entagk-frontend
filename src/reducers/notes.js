import { START_LOADING, END_LOADING, LOGOUT } from "../actions/auth";
import {
  GET_NOTES,
  GET_OPEND_NOTES,
  GET_NOTE,
  ADD_NOTE,
  EDIT_NOTE,
  DELETE_NOTE,
  OPEN_NOTE,
  CLOSE_NOTE,
  INIT_NOTE,
  INITIAL_NOTES_STATE
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
      return {
        ...state,
        isLoading: action.data === 'stickynotes' ? true : state.isLoading
      };

    case END_LOADING:
      return {
        ...state,
        isLoading: action.data === 'stickynotes' ? false : state.isLoading
      };

    case GET_OPEND_NOTES:
      const openedNotes = convertArrayToObject(action.data?.notes, '_id');

      return {
        ...state,
        ...action.data,
        openedNotes: action.data?.notes ? { ids: openedNotes.ids } : { ids: [] },
        notes: action.data?.notes ? openedNotes : { ids: [], objects: {} },
        totalOpenedNotes: openedNotes.ids.length,
      };

    case GET_NOTES:
      localStorage.setItem('sticky-total', Number(action.data.total));
      localStorage.setItem('sticky-currentPage', Number(action.data.currentPage));
      localStorage.setItem('stickyLen', action.data.notes.length + (state.notes?.ids?.length || 0));

      const newNotes = convertArrayToObject(action.data.notes, '_id');

      return {
        ...state,
        ...action.data,
        currentPage: Number(action.data.currentPage),
        notes: {
          objects: { ...state.notes.objects, ...newNotes.objects },
          ids: (state.notes.ids || []).concat(newNotes.ids)
        }
      };

    case GET_NOTE:
      state.notes.objects[action.data._id] = action.data;

      return {
        ...state,
      };

    case INIT_NOTE:
      state.notes.objects[action.data?.id] = action.data;

      return {
        ...state,
        notes: {
          objects: state.notes.objects,
          ids: state.notes.ids.concat([action.data?.id])
        },
        openedNotes: {
          ids: state.openedNotes.ids.concat([action.data.id])
        }
      };

    case ADD_NOTE:
      const newNote = action.data;

      delete state.notes.objects[newNote?.oldId];

      state.notes.objects[newNote.data?._id] = newNote.data;

      return {
        ...state,
        notes: {
          objects: state.notes.objects,
          ids: Object.keys(state.notes.objects).filter(id => id !== newNote.data._id).concat([newNote.data?._id])
        },
        openedNotes: {
          ids: state.openedNotes.ids.filter(id => id !== newNote?.oldId).concat([newNote.data?._id])
        },
        total: state.total + 1,
        totalOpenedNotes: state.totalOpenedNotes + 1
      };

    case OPEN_NOTE:
      state.notes.objects[action.data._id].open = true;

      return {
        ...state,
        openedNotes: {
          ids: state.openedNotes.ids.filter(id => id !== action.data._id).concat([action.data._id])
        }
      };

    case CLOSE_NOTE:
      state.notes.objects[action.data._id].open = false;

      return {
        ...state,
        openedNotes: {
          ids: state.openedNotes.ids.filter(id => id !== action.data._id)
        }
      };

    case EDIT_NOTE:
      state.notes.objects = Object.assign({ [action.data._id]: action.data }, state.notes.objects);

      state.totalOpenedNotes = state.openedNotes.ids.includes(action.data._id) &&
        !action.data.open ?
        state.totalOpenedNotes - 1 :
        state.totalOpenedNotes + 1;

      return {
        ...state,
        notes: {
          objects: state.notes.objects,
          ids: Object.keys(state.notes.objects)
        }
      };

    case DELETE_NOTE:
      state.openedNotes.ids = state.openedNotes?.ids?.filter(n => n !== action.data);
      delete state.notes.objects[action.data];
      state.notes.ids = state.notes?.ids?.filter(n => n !== action.data);

      return {
        ...state,
        total: state.total - 1,
        totalOpenedNotes: state.totalOpenedNotes - 1
      };

    case INITIAL_NOTES_STATE:
      return initialState;

    case LOGOUT:
      return {
        ...state,
        notes: {
          ids: [],
          objects: {}
        },
        openedNotes: {
          ids: [],
          objects: {}
        },
        totalOpenedNotes: 0,
        total: 0
      };

    default:
      return state;
  }
};
