import React from 'react';
import { MdError } from 'react-icons/md';
import { Link } from 'react-router-dom';

import './NotValidTokenPage.css';
import Button from '../../../utils/Components/Button/Button';

function NotValidToken({ message }) {
  return (
    <div className='not-valid-token'>
      <div style={{ fontSize: 200 }} className='icon-continer'><MdError /></div>
      <h1>{message}</h1>
      <div className='buttons'>
        <Button
          component={Link}
          to="/"
          variant='contained'
          aria-label='go-home'
          className='go-home'
        >
          go home
        </Button>
        <Button
          component={Link}
          to="/auth"
          variant='outlined'
          aria-label='go-home'
          className='go-home'
        >
          set passowrd token
        </Button>
      </div>
    </div>
  );
}

export default NotValidToken;
