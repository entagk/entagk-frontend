import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import Loading from '../../../utils/Loading/Loading';

import './style.css';

const TextEditor = lazy(() => import('../../../utils/RichTextEditor/Editor'));
const Header = lazy(() => import('./Header'));

const SingleNote = () => {
  const noteRef = useRef(null);
  const [width, setWidth] = useState(300);
  const [height, setHeigth] = useState(300);

  const [value, setValue] = useState([
    {
      type: "paragraph",
      children: [
        { text: "" }
      ]
    }
  ]);

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

    function Resize(e) {
      const noteWidth = (e.clientX - noteRef.current.offsetLeft);
      const noteHeight = (e.clientY - noteRef.current.offsetTop);

      if (startTrarget.includes('rl')) {
        noteRef.current.style.width = noteWidth + 'px';
        setWidth(noteWidth);
      } else if (startTrarget.includes('tb')) {
        noteRef.current.style.height = noteHeight + 'px';
        setHeigth(noteHeight);
      } else {
        noteRef.current.style.width = noteWidth + 'px';
        setWidth(noteWidth);

        noteRef.current.style.height = noteHeight + 'px';
        setHeigth(noteHeight);
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

      noteRef.current.style.left = left - dx + "px";
      noteRef.current.style.top = top - dy + "px";
    };
  }

  const stopMove = function () {
    window.onmousemove = null;
  };

  return (
    <div
      ref={noteRef}
      className='sticky-note'
      style={{
        width: width,
        height: height,
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
          <TextEditor value={value} setValue={setValue} />
        </Suspense>
      </div>
    </div>
  )
}

export default SingleNote;
