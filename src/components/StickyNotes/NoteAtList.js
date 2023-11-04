import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { deleteNote, DELETE_NOTE } from '../../actions/notes';

import TextEditor from '../../utils/Components/RichTextEditor/Editor';
import Menu from '../../utils/Components/Menu/Menu';
import Button from '../../utils/Components/Button/Button';

import CircularMenu from '../../icons/circularMenu/CircularMenu';

import { RiExternalLinkLine } from 'react-icons/ri';
import { MdDelete } from 'react-icons/md';
import DeletePopupSmaller from '../../utils/Components/DeletePopup/DeletePopupSmaller';
import Loading from '../../utils/Components/Loading/Loading'

export const updatedAt = (t) => {
  const now = new Date(Date.now());
  const date = new Date(t);
  const options = { year: 'numeric', month: 'short', day: 'numeric' };

  if (now.getFullYear() === date.getFullYear()) {
    if (now.getDate() === date.getDate()) {
      return `${date.toLocaleString([], {
        hour: '2-digit',
        minute: '2-digit'
      })}`
    } else {
      return `${date.toLocaleDateString('en', options).split(',')[0]}`;
    }
  } else {
    return `${date.toLocaleDateString('en', options)} `;
  }
}

const NoteAtList = ({ id, onChangeNote, setMessage, setOpenedList }) => {
  const [openMenu, setOpenMenu] = useState(false);
  const note = useSelector(state => state.notes.notes.objects[id]);
  const { openedNotes } = useSelector(state => state.notes);
  const editorContent = [note.content[0]];
  const [openDelete, setOpenDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const openNote = (e) => {
    if (!openedNotes?.objects[id]) {
      setOpenedList(oL => oL.concat([id]));
      if (localStorage.getItem('token'))
        onChangeNote({ id, open: true });
      else
        onChangeNote({ ...note, open: true });
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
    <>
      <div className={`note ${note.color}`} onDoubleClick={openNote} style={{ background: note.color }}>
        {isLoading && (
          <div className='loader-container'>
            <Loading
              color="white"
              backgroud="transparent"
              size="small"
            />
          </div>
        )}
        <div className='note-content'>
          <div className='upper'>
            <p className='date'>
              {updatedAt(note.updatedAt)}
            </p>
            <Menu
              open={openMenu}
              setOpen={setOpenMenu}
              MainButton={
                <Button
                  aria-label="toggle the note list menu"
                  className="toggle-menu"
                  startIcon={
                    <CircularMenu />
                  }
                  variant="single-icon"
                />
              }>
              <Button
                variant="none"
                aria-label="open note button"
                onClick={openNote}
                startIcon={
                  <RiExternalLinkLine />
                }
              >
                Open
              </Button>
              <Button
                variant="none"
                aria-label="delete button"
                onClick={() => setOpenDelete(true)}
                style={{ color: 'red' }}
                className="delete"
                startIcon={
                  <MdDelete />
                }
              >
                Delete
              </Button>
            </Menu>
            {openDelete && (
              <DeletePopupSmaller
                type={'this note'}
                onOk={deleteSingleNote}
                onCancel={() => setOpenDelete(false)}
              />
            )}
          </div>
          <div>
            {
              note?.contentLength?.textLength > 0 ? (
                <TextEditor value={editorContent} setValue={() => { }} readonly />
              ) : (<></>)
            }
          </div>
        </div>
      </div>
    </>
  )
}

export default NoteAtList;
