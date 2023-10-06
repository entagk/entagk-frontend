import React, { lazy, useState, Suspense } from 'react';

import Button from '../../../utils/Button/Button';
import Loading from '../../../utils/Loading/Loading';
import CircularMenu from "../../../icons/circularMenu/CircularMenu";

import { AiOutlinePlus } from 'react-icons/ai';
import { CgClose } from 'react-icons/cg';
import { MdDelete, MdKeyboardArrowRight } from 'react-icons/md';

const Menu = lazy(() => import('../../../utils/Menu/Menu'));

const Header = ({ newNote, noteData, setNoteData, closeNote, setOpenDelete, ...props }) => {
  const [openMenu, setOpenMenu] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const colors = ["pink", "yellow", "orange", "green", "blue"];

  const changeColor = (color) => {
    setNoteData(d => ({ ...d, color: color }));
    console.log(noteData);
  }

  const toggleDelete = () => {
    setOpenDelete(true);
  }

  return (
    <div className='sticky-note-header' {...props}>
      <Suspense
        fallback={
          <Loading
            size="small"
            color={"#fff"}
            backgroud="transparent"
            className="center-fullpage"
          />
        }
      >
        <Menu
          open={openMenu}
          setOpen={setOpenMenu}
          MainButton={
            <Button
              aria-label="toggle the task list menu"
              className="toggle-menu"
              startIcon={
                <CircularMenu />
              }
              variant="single-icon"
            />
          }>
          <Button
            variant="none"
            aria-label="add note button"
            onClick={newNote}
            className="new"
            startIcon={
              <AiOutlinePlus />
            }
          >
            New Note
          </Button>
          <Menu
            open={openColor}
            setOpen={setOpenColor}
            MainButton={
              <Button
                variant="none"
                aria-label="change color menu"
                className="change-color"
                startIcon={
                  <span className='color-icon' style={{ background: noteData.color }}></span>
                }
                endIcon={
                  <MdKeyboardArrowRight />
                }
                style={{
                  background: openColor ? "var(--main-light-black)" : "",
                }}
              >
                Color
              </Button>
            }
            className="menu-content color-menu"
          >
            {colors.map((color) => (
              <Button
                key={color}
                variant="none"
                aria-label={`${color} color`}
                startIcon={
                  <span className='color-icon' style={{ background: color === 'rose' ? 'mistyrose' : color }}></span>
                }
                style={{
                  background: color === noteData.color ? "var(--main-light-black)" : ""
                }}
                onClick={(e) => changeColor(color)}
              >
                {color}
              </Button>
            ))}
          </Menu>
          <Button
            variant="none"
            aria-label="delet button"
            onClick={toggleDelete}
            style={{ color: 'red' }}
            className="delete"
            startIcon={
              <MdDelete />
            }
          >
            Delete
          </Button>
        </Menu>
        <Button
          className="close-note"
          variant='single-icon'
          onClick={closeNote}
          startIcon={<CgClose />}
        />
      </Suspense>
    </div>
  )
}

export default Header;
