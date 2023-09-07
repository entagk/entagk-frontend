import React, { Suspense, lazy, useState } from 'react'
import Loading from '../../utils/Loading/Loading';

import { CgClose } from 'react-icons/cg';
import { AiOutlinePlus } from 'react-icons/ai';
import { MdKeyboardArrowLeft } from 'react-icons/md';

import './style.css';
import { useSelector } from 'react-redux';
import SingleNote from './SingleNote/SingleNote';

const Header = lazy(() => import('../../utils/GlassEffectHeader/header'));
const Button = lazy(() => import('./../../utils/Button/Button'));

const StickyNotes = ({ openSticky, setOpenSticky }) => {
  const [newSticky, setNewSticky] = useState(false);
  const { notes } = useSelector(state => state.notes) || {
    notes: []
  }

  return (
    <>
      {newSticky && (
        <SingleNote />
      )}
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
              title={newSticky ? "new sticky" : 'sticky notes'}
              showLeft={true}
              LeftButton={
                !newSticky ? (
                  <Button
                    aria-label="new sticky"
                    className="new-sticky-btn"
                    type="button"
                    onClick={() => setNewSticky(true)}
                    variant='single-icon'
                    startIcon={
                      <AiOutlinePlus />
                    }
                  />
                ) : (
                  <Button
                    aria-label="back to sticky notes"
                    className="back-to-sticky"
                    type="button"
                    onClick={() => setNewSticky(false)}
                    variant='single-icon'
                    startIcon={
                      <MdKeyboardArrowLeft />
                    }
                  />
                )
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
              {notes.length ? (
                notes.map((note) => (
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
                  onClick={() => setNewSticky(true)}
                >
                  add your first Note
                </Button>
              )}
            </div>
          </Suspense>
        </div>
      </div>
    </>
  )
}

export default StickyNotes;
