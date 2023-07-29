import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { LOGOUT } from '../../../actions/auth';
import Button from '../../../utils/Button/Button';

import './style.css';

function LogoutPage() {
  const dispatch = useDispatch();

  const logout = () => {
    dispatch({ type: LOGOUT })
  }

  return (
    <div className='logout-page'>
      <div>
        <h1>You are log in.</h1>
        <div
          className='buttons'
        >
          <Button
            aria-label="logout button"
            onClick={logout}
            type='button'
            style={{
              margin: 20
            }}
          >Log out</Button>
          {(window.location.pathname === '/' || window.history.length > 2) ? (
            <Button
              component={Link}
              to={-1}
              aria-label='Back'
              variant='outlined'
            >
              Go Back
            </Button>
          ) : (
            <Button
              component={Link}
              to="/"
              aria-label='Back'
              variant='outlined'
            >Go Home</Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default LogoutPage;
