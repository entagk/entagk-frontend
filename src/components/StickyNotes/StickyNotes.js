import React, { Suspense, lazy, useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux';

import { ADD_NOTE, EDIT_NOTE, getNotes } from '../../actions/notes';

import { baseURL } from '../../api/index';
// import { ADD_NOTE, EDIT_NOTE, getNote } from '../../../actions/notes';

import { CgClose } from 'react-icons/cg';
import { AiOutlinePlus } from 'react-icons/ai';

import Loading from '../../utils/Loading/Loading';
import SingleNote from './SingleNote/SingleNote';

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
  coordinates: { width: 300, height: 300 },
  position: { top: 6, left: 0 },
  open: true,
  color: 'yellow'
}

const StickyNotes = ({ openSticky, setOpenSticky }) => {
  const dispatch = useDispatch();
  const { notes, openedNotes, totalOpenedNotes, total } = useSelector(state => state.notes) || {
    notes: {},
    openedNotes: {}
  };
  const notesData = Object.values(notes);

  const [openedList, setOpenedList] = useState(Object.keys(openedNotes));
  const [message, setMessage] = useState({ tyep: "", message: "" });

  const webSocket = useRef(null);

  // get the notes
  useEffect(() => {
    if (totalOpenedNotes < total) {
      dispatch(getNotes(setMessage));
    }

    // eslint-disable-next-line
  }, []);

  const initializeWebsocket = () => {
    webSocket.current = generateWebsocket();
    webSocket.current.onmessage = (ev) => {
      const data = JSON.parse(ev.data);
      if (!data?.message) {
        if (!openedList.includes(data?._id) && !openedNotes[data?._id]) {
          dispatch({ type: ADD_NOTE, data });
          setOpenedList((oL) => oL.concat([data?._id]));
        } else {
          dispatch({ type: EDIT_NOTE, data });
        }
      } else {
        setMessage({ message: data?.message, type: 'error' })
      }
    };
  }

  // initialize the websocket and connect to it.
  useEffect(() => {
    initializeWebsocket();

    // eslint-disable-next-line
  }, []);
  console.log(webSocket.current);

  console.log(openedList);

  // send ws message after any change at note data.
  const onChangeNote = (data) => {
    let timer = null;
    if (webSocket.current?.readyState !== webSocket.current.CLOSED && webSocket.current !== null) {
      webSocket?.current?.send(
        JSON.stringify(data)
      );
      clearTimeout(timer);
    } else {
      setTimeout(() => onChangeNote(data), 5);
    }
  }

  const newNote = () => {
    console.log('add new')
    if (webSocket.current === null)
      initializeWebsocket();
    onChangeNote({ ...initialNote, id: 'new' })
  }

  return (
    <>
      {openedList.length > 0 && (
        <>
          {openedList.map((note) => (
            <SingleNote id={note} key={note} onChangeNote={onChangeNote} setMessage={setMessage} setOpenedList={setOpenedList} />
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
                  {notesData.length > 0 ? (
                    notesData.map((note) => (
                      <div className='note'>
                        {/* {note.content} */}
                      </div>
                    ))
                  ) : (
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
