import React from 'react'
import { useSelector } from 'react-redux'
import Loading from '../../../utils/Components/Loading/Loading';

import { CgTimelapse } from 'react-icons/cg';
import { MdFlashOn } from 'react-icons/md';
import { BsCalendar3 } from 'react-icons/bs';

import {formatTime} from '../../../utils/helper'

import './style.css';

const Summary = () => {
  const { user, isLoading } = useSelector(state => state.auth);

  return (
    <div className='summary'>
      <h2>Some of Statistics</h2>
      {isLoading ? (
        <Loading
          color="white"
          backgroud="transparent"
          size="big"
        />
      ) : (
        <div className='summary-numbers'>
          <div className='summary-number'>
            <span className='icon'>
              <CgTimelapse />
            </span>
            <div>
              <h3>
                {formatTime(user?.totalHours * 60)}
              </h3>
              <p>
                Total time
              </p>
            </div>
          </div>
          <div className='summary-number'>
            <span className='icon'>
              <MdFlashOn />
            </span>
            <div>
              <h3>
                {user?.totalFocusDay}
              </h3>
              <p>
                Total focus days
              </p>
            </div>
          </div>
          <div className='summary-number'>
            <span className='icon'>
              <BsCalendar3 />
            </span>
            <div>
              <h3>
                {user?.totalActiveDay}
              </h3>
              <p>
                Total active days
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Summary
