import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Loading from '../../../utils/Loading/Loading';

import { getNote } from '../../../actions/notes';

import './style.css';

const TextEditor = lazy(() => import('../../../utils/RichTextEditor/Editor'));
const Header = lazy(() => import('./Header'));
const Footer = lazy(() => import('./Footer'));

const SingleNote = ({ id, onChangeNote, setMessage, setOpenedList }) => {
  const noteRef = useRef(null);
  const dispatch = useDispatch();

  const note = useSelector(state => state.notes.notes[id]);

  const [noteData, setNoteData] = useState(note);
  const [hasChanged, setHasChanged] = useState(false);

  const [openDelete, setOpenDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

      setNoteData((nD) => ({ ...nD, coordinates: { width: width, height: height } }));
      // if (!id.includes('new')) {
      setHasChanged(true);
      // }
    }

    function Resize(e) {
      const noteWidth = (e.clientX - noteRef.current.offsetLeft);
      const noteHeight = (e.clientY - noteRef.current.offsetTop);

      if (startTrarget?.includes('rl')) {
        changeCoordinates(noteWidth, noteData?.coordinates.height);
      } else if (startTrarget.includes('tb')) {
        changeCoordinates(noteData?.coordinates.width, noteHeight);
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

  // function to add a mousemove event from window
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
      setNoteData((nD) => ({ ...nD, position: { left: newLeft, top: newTop } }));
      // if (!id.includes('new')) {
      setHasChanged(true);
      // }
    };
  }

  // function to remove mousemove event from window
  const stopMove = function () {
    window.onmousemove = null;
  };

  // get the note data
  useEffect(() => {
    if (
      !id.includes('new')
      && noteData?._id
      && (
        !noteData?.content
        || noteData?.contentLength.arrayLength !== noteData?.content?.length
      )
    ) {
      dispatch(getNote(id, setNoteData, setIsLoading, setMessage));
    }
    // eslint-disable-next-line
  }, [id]);

  const changeContent = (value) => {
    setNoteData((nD) => ({ ...nD, content: value }));
    // if the content value equal note content
    if (JSON.stringify(value) !== JSON.stringify(noteData?.content)) {
      setHasChanged(true);
      console.log('changed content');
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (hasChanged) {
        onChangeNote(noteData);
      }

    }, 1000);
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line
  }, [noteData]);

  const closeNote = () => {
    setOpenedList(oL => oL.filter(o => o !== id));
    onChangeNote({ id, open: false });
  }

  return (
    <div
      ref={noteRef}
      className='sticky-note'
      style={{
        ...noteData?.coordinates,
        ...noteData?.position,
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
          closeNote={closeNote}
          setHasChanged={setHasChanged}
          setOpenDelete={setOpenDelete}
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
          {(noteData?._id && !noteData?.content) ? (
            <Loading
              color="white"
              backgroud="transparent"
              size="big"
            />
          ) : (
            <TextEditor value={noteData.content} setValue={changeContent} />
          )}
          <Footer />
        </Suspense>
      </div>
    </div>
  )
}

export default SingleNote;
