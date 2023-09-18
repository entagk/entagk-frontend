import React, { useState } from 'react';
import TextEditor from '../../utils/RichTextEditor/Editor';
import Menu from '../../utils/Menu/Menu';
import Button from '../../utils/Button/Button';

import CircularMenu from '../../icons/circularMenu/CircularMenu';
import { useSelector } from 'react-redux';

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
  const [updated, setUpdated] = useState(updatedAt(note.updatedAt));

  setInterval(() => {
    setUpdated(updatedAt(note?.updatedAt));
  }, 10000);

  const openNote = (e) => {
    console.log(openedNotes);
    if (!openedNotes?.objects[id]) {
      setOpenedList(oL => oL.concat([id]));
      onChangeNote({ id, open: true });
    }
  }

  return (
    <div className='note' onDoubleClick={openNote} style={{ background: note.color }}>
      <div className='note-container'>
        <div className='upper'>
          <p>
            {updated}
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
            {/* <Button
              variant="none"
              aria-label="delet button"
              onClick={toggleDelete}
              style={{ color: 'red' }}
              className="delete"
              startIcon={
                <MdDelete />
              }
            >
              <>Delete</>
            </Button> */}
          </Menu>
        </div>
        <div>
          {
            note?.contentLength?.textLength > 0 ? (
              <TextEditor value={[note.content[0]]} setValue={() => { }} readonly />
            ) : (<></>)
          }
        </div>
      </div>
    </div>
  )
}

export default NoteAtList;
