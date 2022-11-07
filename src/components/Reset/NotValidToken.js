import React from 'react';
import { MdError } from 'react-icons/md';
import { Link } from 'react-router-dom';

import './NotValidTokenPage.css';

function NotValidToken({ message }) {
  return (
    <div className='not-valid-token'>
      <h1><MdError /></h1>
      <h2>{message}</h2>
      <div className='buttons'>
        <Link to="/" aria-label='go-home' className='go-home'>go home page</Link>
        <Link to="/auth" aria-label='go-auth' className='go-auth'>go auth page</Link>
      </div>
    </div>
  );
}

export default NotValidToken;