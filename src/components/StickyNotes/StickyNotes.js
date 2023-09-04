import React, { Suspense, lazy, useState } from 'react'
import Loading from '../../utils/Loading/Loading';

import { CgClose } from 'react-icons/cg';
import { AiOutlinePlus } from 'react-icons/ai';
import { MdKeyboardArrowLeft } from 'react-icons/md';

import './style.css';

const Header = lazy(() => import('../../utils/GlassEffectHeader/header'));
const Button = lazy(() => import('./../../utils/Button/Button'));

const StickyNotes = ({ openSticky, setOpenSticky }) => {
  const [newSticky, setNewSticky] = useState(false);

  return (
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
        </Suspense>
      </div>
    </div>
  )
}

export default StickyNotes;
