import React from 'react';

import { stringToColor } from '../../utils/helper';

import { RiMedalFill } from 'react-icons/ri'
import { useSelector } from 'react-redux';

const User = ({ user, number }) => {
  const auth = useSelector(state => state.auth);

  return (
    <div className={`user ${user._id === auth.user?._id ? 'active' : ""}`}>
      {number <= 3 ? (
        <span className={`icon ${number === 1 ? 'first' : number === 2 ? 'second' : 'third'}`}>
          <RiMedalFill />
        </span>
      ) : (
        <span className='num'>
          {number}
        </span>
      )
      }
      <div
        className='avatar'
        style={{ background: stringToColor(user?.name), padding: user?.avatar && 0 }}>
        {user?.avatar ? (
          <img
            src={user?.avatar}
            alt="avatar"
            width="50"
            height="50"
          />
        ) : (
          <span>
            {user.name[0].toUpperCase()}
          </span>
        )}
      </div>
      <div className='inner-data'>
        <p className='name'>
          {user.name}
        </p>
        <p>
          {user.totalHours} {user.totalHours === 1 ? "Hour" : "Hours"}
        </p>
      </div>
    </div>
  )
}

export default User;
