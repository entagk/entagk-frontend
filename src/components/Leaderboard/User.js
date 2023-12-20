import React from 'react';

import { stringToColor } from '../../utils/helper';

import { RiMedalFill } from 'react-icons/ri'
import { useSelector } from 'react-redux';

const User = ({ user, number }) => {
  const auth = useSelector(state => state.auth);

  return (
    <div className={`user ${user._id === auth.user?._id ? 'active' : ""}`}>
      <div className='inner-data'>
        {number <= 3 ? (
          <span className={`icon ${number === 1 ? 'first' : number === 2 ? 'second' : 'third'}`}>
            <RiMedalFill />
          </span>
        ) : (
          <span className='num'>
            {number}
          </span>
        )}
        {user?.avatar ? (
          <div
            className='avatar'
            style={{ background: stringToColor(user?.name), padding: user?.avatar && 0 }}>
            <img
              src={user?.avatar}
              alt="avatar"
            />
          </div>
        ) : (
          <span
            className='text-avatar'
            style={{ background: stringToColor(user?.name), padding: user?.avatar && 0 }}
          >
            {user.name[0].toUpperCase()}
          </span>
        )}
        <p className='name' title={user.name}>
          {user.name}
        </p>
        <p className='total-hours'>
          <span>
            {user.totalHours.toFixed(2)}
          </span>
          {user.totalHours === 1 ? "Hour" : "Hours"}
        </p>
      </div>
    </div>
  )
}

export default User;
