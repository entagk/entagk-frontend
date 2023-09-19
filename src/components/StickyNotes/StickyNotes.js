import React, { Suspense, lazy, useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux';

import { ADD_NOTE, EDIT_NOTE, GET_NOTE, INIT_NOTE, getNotes } from '../../actions/notes';

import { baseURL } from '../../api/index';
// import { ADD_NOTE, EDIT_NOTE, getNote } from '../../../actions/notes';

import { CgClose } from 'react-icons/cg';
import { AiOutlinePlus } from 'react-icons/ai';

import Loading from '../../utils/Loading/Loading';
import SingleNote from './SingleNote/SingleNote';

import NoteAtList from './NoteAtList';

import './style.css';

const Header = lazy(() => import('../../utils/GlassEffectHeader/header'));
const Button = lazy(() => import('./../../utils/Button/Button'));

const generateWebsocket = () => {
  return new WebSocket(
    `${baseURL.replace('http', 'ws')
    }/stickynote/?authorization=Bearer ${localStorage.getItem('token')}`
  );
}

const initialNote = {
  content: [
    {
      type: "paragraph",
      children: [
        { text: "" }
      ]
    }
  ],
  contentLength: { textLength: 0, arrayLength: 1 },
  coordinates: { width: 300, height: 300 },
  position: { top: 6, left: 0 },
  open: true,
  color: 'yellow',
  updatedAt: new Date().toJSON()
}

const StickyNotes = ({ openSticky, setOpenSticky }) => {
  const dispatch = useDispatch();
  const { notes, openedNotes, totalOpenedNotes, total, isLoading } = useSelector(state => state.notes) || {
    notes: {
      ids: []
    },
    openedNotes: {
      ids: []
    }
  };
  // const notesData = notes?.ids || [];

  const [openedList, setOpenedList] = useState(openedNotes?.ids);
  const [message, setMessage] = useState({ tyep: "", message: "" });

  const webSocket = useRef(null);

  // get the notes
  useEffect(() => {
    if (totalOpenedNotes < total && total > 0 && openSticky) {
      dispatch(getNotes(setMessage));
    }

    // eslint-disable-next-line
  }, [openSticky]);

  const checkNoteId = useCallback((id) => {
    console.log(notes);
    return notes.ids.includes(id) && notes?.objects[id]
  }, [notes]);

  const initWebSocket = () => {
    if (webSocket.current === null)
      webSocket.current = generateWebsocket();
    webSocket.current.onmessage = (ev) => {
      const data = JSON.parse(ev.data);
      if (!data?.message) {
        if (!checkNoteId(data?._id)) {
          dispatch({ type: ADD_NOTE, data });
          setOpenedList((oL) => {
            const newOL = oL.filter(n => n !== data?.oldId);
            return newOL.concat([data?._id]);
          });
        } else {
          dispatch({ type: EDIT_NOTE, data });
        }
      } else {
        setMessage({ message: data?.message, type: 'error' })
      }
    };
  }

  // initialize the websocket and connect to it.
  useEffect(
    initWebSocket,
    // eslint-disable-next-line 
    [notes]
  );

  // send ws message after any change at note data.
  const onChangeNote = (data) => {
    let timer = null;
    if (
      webSocket.current?.readyState === webSocket.current?.OPEN
      && webSocket.current !== null
    ) {
      webSocket?.current?.send(
        JSON.stringify(data)
      );
      clearTimeout(timer);
    } else if (webSocket.current?.readyState > 1) {
      initWebSocket();
      setTimeout(() => onChangeNote(data), 5);
    }
  }

  const newNote = () => {
    const newId = `new-${openedList.length + 1}`;
    setOpenedList(oL => oL.concat([newId]));
    dispatch({ type: INIT_NOTE, data: { id: newId, ...initialNote } });
    // onChangeNote({ ...initialNote, id: 'new' })
  }

  return (
    <>
      {openedList.length > 0 && (
        <>
          {openedList.map((note) => (
            <SingleNote
              key={note}
              id={note}
              newNote={newNote}
              onChangeNote={onChangeNote}
              setMessage={setMessage}
              setOpenedList={setOpenedList}
            />
          ))}
        </>
      )}
      <React.Suspense
        fallback={
          <>
            <div className='glass-container'>
              <Loading
                color="white"
                backgroud="transparent"
                className="glass-effect todo-loader"
                size="big"
              />
            </div>
          </>
        }
      >
        {openSticky && (
          <div className="glass-container">
            <div className='glass-effect sticky-notes'>
              <Suspense
                fallback={
                  <>
                    <Loading
                      color="white"
                      backgroud="transparent"
                      size="big"
                    />
                  </>
                }>
                <Header
                  className="header"
                  title={'sticky notes'}
                  showLeft={true}
                  LeftButton={
                    <Button
                      aria-label="new sticky"
                      className="new-sticky-btn"
                      type="button"
                      onClick={newNote}
                      variant='single-icon'
                      startIcon={
                        <AiOutlinePlus />
                      }
                    />
                  }
                  RightButton={
                    <Button
                      aria-label='close edit account'
                      className="close"
                      type='button'
                      onClick={() => setOpenSticky(false)}
                      variant='none'
                      startIcon={
                        <CgClose />
                      }
                    />
                  }
                />
                <div className='notes'>
                  {total === 0 ? (
                    <Button
                      type="button"
                      className="add-new-note"
                      startIcon={
                        <AiOutlinePlus />
                      }
                      color="main"
                      style={{
                        textTransform: "capitalize"
                      }}
                      onClick={newNote}
                    >
                      add your first Note
                    </Button>
                  ) : (
                    <>
                      {isLoading && notes.ids.length === 0 ?
                        (
                          <Loading
                            size="medium"
                            color={"#fff"}
                            backgroud="transparent"
                            style={{ marginTop: 0 }}
                          />
                        ) :
                        notes?.ids?.map((note) => (
                          <NoteAtList
                            id={note}
                            key={note}
                            onChangeNote={onChangeNote}
                            setMessage={setMessage}
                            openedList={openedList}
                            setOpenedList={setOpenedList}
                          />
                        ))
                      }
                    </>
                  )}
                </div>
              </Suspense>
            </div>
          </div>
        )}
      </React.Suspense>
    </>
  )
}

export default StickyNotes;
