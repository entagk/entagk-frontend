import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Loading from '../../../utils/Components/Loading/Loading';

import { CLOSE_NOTE, DELETE_NOTE, deleteNote, getNote } from '../../../actions/notes';

import './style.css';

const TextEditor = lazy(() => import('../../../utils/Components/RichTextEditor/Editor'));
const Header = lazy(() => import('./Header'));
const DeletePopupSmaller = lazy(() => import('../../../utils/Components/DeletePopup/DeletePopupSmaller'));

const defaultContent = [
  {
    type: "paragraph",
    children: [
      { text: "" }
    ]
  }
];

const contentTextLength = (content) => {
  let textLength = 0;
  for (const row of content) {
    if (row.children.length === 0) {
      return textLength;
    }

    if (row.type === "numbered-list" || row.type === "bulleted-list") {
      const listTextLength = contentTextLength(row.children);
      textLength += listTextLength;
    } else {
      for (const text of row.children) {
        if (text.type === 'link') {
          textLength += text.children[0].text?.trim()?.length;
        } else
          textLength += text.text?.trim()?.length;
      };
    }
  }

  return textLength;
}

const SingleNote = ({ id, newNote, onChangeNote, setMessage, active, setActive }) => {
  const noteRef = useRef(null);
  const dispatch = useDispatch();

  const note = useSelector(state => state.notes.notes.objects[id]);

  const [noteData, setNoteData] = useState(note);
  const [hasChanged, setHasChanged] = useState(false);

  const [openDelete, setOpenDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(noteData?.content?.length < noteData?.contentLength?.arrayLength);
  const [maxContentHeight, setMaxContentHeight] = useState(noteData?.coordinates?.height);

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
      if (width < 300) width = 300;
      if (height < 300) height = 300;

      noteRef.current.style.width = width + 'px';
      noteRef.current.style.height = height + 'px';

      setNoteData((nD) => ({ ...nD, coordinates: { width: width, height: height } }));
      setHasChanged(true);
    }

    function Resize(e) {
      const noteWidth = (e.clientX - noteRef.current.offsetLeft);
      const noteHeight = (e.clientY - noteRef.current.offsetTop);

      if (startTrarget?.includes('right')) {
        changeCoordinates(noteWidth, noteData?.coordinates.height);
      } else if (startTrarget.includes('bottom')) {
        changeCoordinates(noteData?.coordinates.width, noteHeight);
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

  useEffect(() => {
    if (noteRef.current) {
      const editorConetent = noteRef.current.querySelector('.text-editor .content');
      setMaxContentHeight(noteData.coordinates.height - editorConetent?.offsetTop - 20);
    }

    // eslint-disable-next-line
  }, [noteRef, noteData,]);

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
      setHasChanged(true);
    };
  }

  // function to remove mousemove event from window
  const stopMove = function () {
    window.onmousemove = null;
  };

  useEffect(() => {
    if (JSON.stringify(note) !== JSON.stringify(noteData) && note?.content.length > noteData?.content.length) {
      setNoteData(note);
    }
    // eslint-disable-next-line
  }, [note]);

  // get the note data
  useEffect(() => {
    if (
      noteData?.contentLength.arrayLength > noteData?.content?.length
      && noteData?.contentLength.textLength > 0
    ) {
      dispatch(getNote(id, setNoteData, setIsLoading, setMessage));
    } else if (id.includes('new')) {
      setNoteData(data => ({ ...data, content: defaultContent }));
    }
    // eslint-disable-next-line
  }, []);

  const changeContent = (value) => {
    setNoteData((nD) => ({ ...nD, content: value }));
    // if the content value equal note content
    if (JSON.stringify(value) !== JSON.stringify(noteData?.content)) {
      setHasChanged(true);
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (hasChanged) {
        const contentLength = contentTextLength(noteData.content);
        if (JSON.stringify(note) !== JSON.stringify(noteData))
          if ((id.includes('new') && contentLength > 0) || !id.includes('new'))
            onChangeNote({
              action: id.includes('new') ? "add" : "edit",
              data: {
                ...noteData,
                contentLength: {
                  textLength: contentLength,
                  arrayLength: noteData.content.length
                },
                id,
              }
            });
      }

    }, 1000);
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line
  }, [noteData]);

  const closeNote = () => {
    const contentLength = contentTextLength(noteData.content);
    if (contentLength === 0 && JSON.stringify(note?.content) === JSON.stringify(noteData?.content)) {
      if (!id.includes('new')) {
        dispatch(deleteNote(id, setIsLoading, setMessage));
      } else {
        dispatch({ type: DELETE_NOTE, data: id });
      }
    } else {
      dispatch({ type: CLOSE_NOTE, data: { open: false, _id: id } });

      if (id.includes('new')) {
        onChangeNote({
          action: 'add',
          data: {
            ...noteData, id: 'new', open: false
          }
        });
      } else {
        onChangeNote({
          action: 'close',
          data: localStorage.getItem('token') ?
            {
              id, open: false
            } :
            { ...noteData, id, open: false }
        });
      }
    }
  }

  const deleteSingleNote = () => {
    setOpenDelete(false);

    if (!id.includes('new')) {
      dispatch(deleteNote(id, setIsLoading, setMessage));
    } else {
      dispatch({ type: DELETE_NOTE, data: id });
    }
  }

  return (
    <div
      className={`note-container ${active === id ? 'active' : ''}`}
      ref={noteRef}
      style={{
        ...noteData?.position,
      }}
      onClick={() => setActive(pA => pA !== id ? id : pA)}
    >
      <div
        className={`sticky-note ${noteData.color} center`}
        style={{
          ...noteData?.coordinates,
          maxWidth: window.document.documentElement.clientWidth - 20,
          maxHeight: window.document.documentElement.clientHeight - 30,
          background: noteData.color !== 'rose' ? noteData.color : 'mistyrose',
        }}
      >
        <div className='note-content'>
          {openDelete && (
            <div className='delete-popup-container'>
              <DeletePopupSmaller
                type={'this note'}
                onOk={deleteSingleNote}
                onCancel={() => setOpenDelete(false)}
              />
            </div>
          )}
          <Header
            newNote={newNote}
            onMouseDown={moveNote}
            onMouseUp={stopMove}
            closeNote={closeNote}
            noteData={noteData}
            setNoteData={setNoteData}
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
            {(isLoading) ? (
              <Loading
                color="white"
                backgroud="transparent"
                size="big"
              />
            ) : (
              <TextEditor
                value={noteData.content}
                setValue={changeContent}
                maxContentHeight={maxContentHeight}
              />
            )}
          </Suspense>
        </div>
      </div>
      <div className="right rl"></div>
      <div className="bottom tb"></div>
    </div>
  )
}

export default SingleNote;
