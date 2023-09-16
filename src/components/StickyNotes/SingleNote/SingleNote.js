import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Loading from '../../../utils/Loading/Loading';

import { baseURL } from '../../../api/index';
import { ADD_NOTE, EDIT_NOTE, getNote } from '../../../actions/notes';

import './style.css';

const TextEditor = lazy(() => import('../../../utils/RichTextEditor/Editor'));
const Header = lazy(() => import('./Header'));
const Footer = lazy(() => import('./Footer'));

const generateWebsocket = () => {
  return new WebSocket(
    `${baseURL.replace('http', 'ws')
    }/stickynote/?authorization=Bearer ${localStorage.getItem('token')}`
  );
}

const SingleNote = ({ id, setMessage }) => {
  const noteRef = useRef(null);
  const dispatch = useDispatch();
  const webSocket = generateWebsocket(id);
  const [hasChanged, setHasChanged] = useState(false);

  const noteData = useSelector(state => state.notes.notes[id]) || {};
  // const [openDelete, setOpenDelete] = useState(false);

  const [coordinates, setCoordinates] = useState(
    noteData?.coordinates ?
      noteData?.coordinates :
      { width: 300, height: 300 }
  ); // you will store the coordinates with note data. 
  const [position, setPoistion] = useState(
    noteData?.position ?
      noteData?.position :
      { top: 6, left: 0 }
  ); // you will store the position with note data.

  const [content, setContent] = useState(
    noteData?.content ?
      noteData.content :
      [
        {
          type: "paragraph",
          children: [
            { text: "" }
          ]
        }
      ]
  );

  // for resizeing the note.
  useEffect(() => {
    noteRef.current.addEventListener('mousedown', initResize, false);
    let startTrarget;

    function initResize(e) {
      window.document.documentElement.style.userSelect = 'none';
      noteRef.current.style.userSelect = 'none';

      startTrarget = e.target.className;
      if (startTrarget !== 'sticky-note-header') {
        window.addEventListener('mousemove', Resize, false);
        window.addEventListener('mouseup', stopResize, false);
      }
    }

    function changeCoordinates(width, height) {
      noteRef.current.style.width = width + 'px';
      noteRef.current.style.height = height + 'px';

      if (width < 300) width = 300;
      if (height < 300) height = 300;

      setCoordinates({ width: width, height: height });
    }

    function Resize(e) {
      const noteWidth = (e.clientX - noteRef.current.offsetLeft);
      const noteHeight = (e.clientY - noteRef.current.offsetTop);

      if (startTrarget?.includes('rl')) {
        changeCoordinates(noteWidth, coordinates.height);
      } else if (startTrarget.includes('tb')) {
        changeCoordinates(coordinates.width, noteHeight);
      } else {
        changeCoordinates(noteWidth, noteHeight);
      }
    }

    function stopResize(e) {
      window.removeEventListener('mousemove', Resize, false);
      window.removeEventListener('mouseup', stopResize, false);
    }

    return () => {
      window.removeEventListener('mousemove', Resize, false);
      window.removeEventListener('mouseup', stopResize, false);
    };
  });

  const moveNote = function (e) {
    const left = parseInt(window.getComputedStyle(noteRef.current).getPropertyValue("left"));
    const top = parseInt(window.getComputedStyle(noteRef.current).getPropertyValue("top"));

    const mouseX = e.clientX;
    const mouseY = e.clientY;

    window.onmousemove = function (e) {
      const dx = mouseX - e.clientX;
      const dy = mouseY - e.clientY;

      const newLeft = left - dx;
      const newTop = top - dy;
      noteRef.current.style.left = newLeft + "px";
      noteRef.current.style.top = newTop + "px";
      setPoistion({ left: newLeft, top: newTop });
    };
  }

  const stopMove = function () {
    window.onmousemove = null;
  };

  webSocket.onmessage = (ev) => {
    const data = JSON.parse(ev.data);
    console.log(data);
    if (!data?.message) {
      if (id.includes('new')) {
        dispatch({ type: ADD_NOTE, data: { ...data, oldId: id } });
      } else {
        dispatch({ type: EDIT_NOTE, data });
      }
    } else {
      setMessage({ message: data?.message, type: 'error' })
    }
  };

  // get the note data
  useEffect(() => {
    if (
      !id.includes('new') &&
      !noteData?._id &&
      noteData?.contentLength !== noteData?.content?.length
    ) {
      dispatch(getNote(id));
    }
    // eslint-disable-next-line
  }, [id]);

  // send ws message after any change at note data.
  const onChangeNote = () => {
    let timer = null;
    if (webSocket.readyState !== webSocket.CLOSED) {
      webSocket.send(
        JSON.stringify({
          id: id.includes('new') ? 'new' : id,
          content,
          position,
          coordinates
        })
      );
      console.log('timer for sending')
      clearTimeout(timer);
    } else {
      setTimeout(onChangeNote, 5);
    }
  }

  const changeContent = (value) => {
    setContent(value);
    setHasChanged(true);
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (hasChanged)
        onChangeNote();

    }, 1000);
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line
  }, [content, position, coordinates]);

  return (
    <div
      ref={noteRef}
      className='sticky-note'
      style={{
        ...coordinates,
        ...position,
        maxWidth: window.document.documentElement.clientWidth - 20,
        maxHeight: window.document.documentElement.clientHeight - 30
      }}
    >
      <div className='sides'>
        <div className='top tb'></div>
        <div className='bottom tb'></div>
        <div className='right rl'></div>
        <div className='left rl'></div>
        <div className='top-right'></div>
        <div className='bottom-right'></div>
        <div className='top-left'></div>
        <div className='bottom-left'></div>
      </div>
      <div className='note-content'>
        <Header
          onMouseDown={moveNote}
          onMouseUp={stopMove}
        />
        <Suspense
          fallback={
            <Loading
              color="white"
              backgroud="transparent"
              size="big"
            />
          }
        >
          <TextEditor value={content} setValue={changeContent} />
          <Footer />
        </Suspense>
      </div>
    </div>
  )
}

export default SingleNote;
