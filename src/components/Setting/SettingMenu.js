import React, { lazy } from 'react';

import { AiFillSound } from 'react-icons/ai';
import { BsArrowRight } from 'react-icons/bs';
import { CgTimelapse } from 'react-icons/cg';
import { MdNotifications } from 'react-icons/md';
import { TbFocus } from 'react-icons/tb';

const Button = lazy(() => import('../../utils/Components/Button/Button'));

function SettingMenu({setStatus, }) {
  return (
    <div className='setting-menu'>
      <Button
        aria-label='timer setting button'
        type='button'
        onClick={() => setStatus('timer')}
        variant='none'
        endIcon={
          <BsArrowRight />
        }
      >
        <span style={{ marginRight: "40px" }}>
          <CgTimelapse />
          <span className='text'>Timer Setting </span>
        </span>
      </Button>
      <Button
        aria-label='sounds setting button'
        type='button'
        variant='none'
        endIcon={
          <BsArrowRight />
        }
        onClick={() => setStatus('sounds')}>
        <span style={{ marginRight: "40px" }}>
          <AiFillSound />
          <span className='text'>Sounds Setting</span>
        </span>
      </Button>
      {"Notification" in window && (
        <Button
          aria-label='notifications setting button'
          type='button'
          variant='none'
          endIcon={
            <BsArrowRight />
          }
          onClick={() => setStatus('notifications')}>
          <span style={{ marginRight: "40px" }}>
            <MdNotifications />
            <span className='text'>Notifications Setting</span>
          </span>
        </Button>
      )}
      <Button
        aria-label='focus setting button'
        type='button'
        variant='none'
        endIcon={
          <BsArrowRight />
        }
        onClick={() => setStatus('focus')}>
        <span style={{ marginRight: "40px" }}>
          <TbFocus />
          <span className='text'>Focus Setting</span>
        </span>
      </Button>
    </div>
  );
}

export default SettingMenu;
