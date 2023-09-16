import React, { Suspense, lazy, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';

import { INIT_NOTE, getOpenedNotes } from '../../actions/notes';

import { CgClose } from 'react-icons/cg';
import { AiOutlinePlus } from 'react-icons/ai';

import Loading from '../../utils/Loading/Loading';
import SingleNote from './SingleNote/SingleNote';

import './style.css';

const Header = lazy(() => import('../../utils/GlassEffectHeader/header'));
const Button = lazy(() => import('./../../utils/Button/Button'));

const StickyNotes = ({ openSticky, setOpenSticky }) => {
  const dispatch = useDispatch();
  const { notes, openedNotes, totalOpenedNotes, total } = useSelector(state => state.notes) || {
    notes: {},
    openedNotes: {}
  };
  const notesData = Object.values(notes);

  const openedList = Object.keys(openedNotes);
  const [message, setMessage] = useState({ tyep: "", message: "" })

  // get the notes
  useEffect(() => {
    if (totalOpenedNotes < total) {
      // dispatch(getNotes)
    }
  })

  return (
    <>
      {openedList.length > 0 && (
        <>
          {openedList.map((note) => (
            <SingleNote id={note} key={note} setMessage={setMessage} />
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
                      onClick={() => dispatch({ type: INIT_NOTE, data: { id: `new-${openedList.length + 1}` } })}
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
                        {note.content}
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
                      onClick={() => dispatch({ type: INIT_NOTE, data: { id: `new-${openedList.length + 1}` } })}
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
