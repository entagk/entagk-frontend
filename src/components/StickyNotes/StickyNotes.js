import React, { Suspense, lazy, useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux';

import { ADD_NOTE, EDIT_NOTE, INIT_NOTE, getNotes } from '../../actions/notes';
import { addNew, updateOne } from '../../utils/indexedDB/db';

import { BASE_URL } from '../../api/index';

import { onScroll } from '../../utils/helper';

import { CgClose } from 'react-icons/cg';
import { AiOutlinePlus } from 'react-icons/ai';

import Loading from '../../utils/Components/Loading/Loading';
import SingleNote from './SingleNote/SingleNote';

import NoteAtList from './NoteAtList';

import './style.css';

const Header = lazy(() => import('../../utils/Components/GlassEffectHeader/header'));
const Button = lazy(() => import('./../../utils/Components/Button/Button'));

const generateWebsocket = () => {
  return new WebSocket(
    `${BASE_URL.replace('http', 'ws')
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

const StickyNotes = ({ openSticky, setOpenSticky, setMessage }) => {
  const dispatch = useDispatch();
  const [activeNote, setActiveNote] = useState('');
  const [page, setPage] = useState(1);
  const {
    notes,
    openedNotes,
    totalOpenedNotes,
    total,
    isLoading,
    currentPage,
    numberOfPages
  } = useSelector(state => state.notes) || {
    notes: {
      ids: []
    },
    openedNotes: {
      ids: []
    }
  };

  const webSocket = useRef(null);

  // get the notes
  useEffect(() => {
    if (totalOpenedNotes < total && total > 0 && openSticky && !currentPage) {
      dispatch(getNotes(setMessage, 1));
    }

    // eslint-disable-next-line
  }, [openSticky]);

  // initialize the websocket and connect to it.
  useEffect(() => {
    if (localStorage.getItem('token')) {
      if (!webSocket.current || !webSocket.current?.readyState === 1)
        webSocket.current = generateWebsocket();
      function onmessage(ev) {
        const msgData = JSON.parse(ev.data);
        if (!msgData?.message) {
          if (msgData.action === 'add') {
            dispatch({ type: ADD_NOTE, data: { data: msgData.data, oldId: msgData.oldId } });
          } else if (msgData.action === 'edit') {
            dispatch({ type: EDIT_NOTE, data: msgData.data });
          }
        } else {
          setMessage({ message: msgData?.message, type: 'error' })
        }
      }
      webSocket.current.onmessage = onmessage;

      webSocket.current.onclose = (ev) => {
        reconnect();
      }

      const reconnect = () => {
        setTimeout(() => {
          webSocket.current = generateWebsocket();
          webSocket.current.onmessage = onmessage;
        }, 300);
      }

      return () => {
        // Cleanup function to close the WebSocket connection when the component unmounts
        if (webSocket.current) {
          webSocket.current.close();
        }
      };
    }
  },
    // eslint-disable-next-line 
    [notes]
  );

  useEffect(() => {
    onScroll(setPage, 'sticky-total', 'stickyLen', 'sticky-currentPage', "notes", 'notes-list');
    // eslint-disable-next-line
  }, [notes, total]);

  useEffect(() => {
    if (page > currentPage) {
      dispatch(getNotes(setMessage, page));
    }

    // eslint-disable-next-line
  }, [page]);

  // send ws message after any change at note data.
  const onChangeNote = async (data) => {
    if (localStorage.getItem('token')) {
      if (
        webSocket.current?.readyState === webSocket.current?.OPEN
        && webSocket.current !== null
      ) {
        webSocket?.current?.send(
          JSON.stringify(data)
        );
      }
    } else {
      data.data.updatedAt = new Date().toJSON();
      if (data.action === 'add') {
        data.data.oldId = data.id;

        const addedNote = await addNew('notes', data.data);

        dispatch({ type: ADD_NOTE, data: addedNote });
      } else {
        const updatedNote = await updateOne(data.data, 'notes');

        dispatch({ type: EDIT_NOTE, data: updatedNote });
      }
    }
  }

  const newNote = () => {
    const newId = `new-${openedNotes?.ids?.length + 1}`;
    dispatch({ type: INIT_NOTE, data: { id: newId, ...initialNote } });
  }

  return (
    <>
      {openedNotes?.ids?.length > 0 && (
        <>
          {openedNotes?.ids?.map((note) => (
            <SingleNote
              key={note}
              id={note}
              newNote={newNote}
              onChangeNote={onChangeNote}
              setMessage={setMessage}
              active={activeNote}
              setActive={setActiveNote}
            />
          ))}
        </>
      )}
      <React.Suspense
        fallback={
          <>
            <div className='glass-container'>
              <div className='glass-effect todo-loader'>
                <div className='header'>
                  <h2>loading setting...</h2>
                </div>
                <Loading
                  color="white"
                  backgroud="transparent"
                  size="big"
                />
              </div>
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
                    <div className='glass-effect todo-loader'>
                      <div className='header'>
                        <h2>loading sticky notes...</h2>
                      </div>
                      <Loading
                        color="white"
                        backgroud="transparent"
                        size="big"
                      />
                    </div>
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
                      {isLoading && notes?.ids?.length === 0 ?
                        (
                          <Loading
                            size="big"
                            color={"#fff"}
                            backgroud="transparent"
                            style={{ marginTop: 0 }}
                          />
                        ) : (
                          <>
                            <div className='notes-list'>
                              {
                                notes?.ids?.map((note) => (
                                  <NoteAtList
                                    id={note}
                                    key={note}
                                    onChangeNote={onChangeNote}
                                    setMessage={setMessage}
                                    setActiveNote={setActiveNote}
                                  />
                                ))
                              }
                            </div>
                            {isLoading && (
                              <Loading
                                size="medium"
                                color={"#fff"}
                                backgroud="transparent"
                                style={{ marginTop: 0 }}
                              />
                            )}
                            {
                              (Number(currentPage) < numberOfPages && Number(currentPage) >= 1 && !isLoading) && (
                                <div>
                                  <Button
                                    onClick={() => setPage(p => p + 1)}
                                  >
                                    Load more
                                  </Button>
                                </div>
                              )
                            }
                          </>
                        )
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
