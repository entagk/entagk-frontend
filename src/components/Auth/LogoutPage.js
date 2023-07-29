import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { LOGOUT } from '../../actions/auth';
import Button from '../../utils/Button/Button';

function LogoutPage() {
  const dispatch = useDispatch();

  const logout = () => {
    dispatch({ type: LOGOUT })
  }
  return (
    <div>
      <div>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          color: "#fff"
        }}>
          <h1>You are log in.</h1>
          <div
            className='buttons'
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
              width: '100%',
            }}
          >
            <Button
              aria-label="logout button"
              onClick={logout}
              type='button'
            >Log out</Button>
            <Button
              component={Link}
              to="/"
              aria-label='Back'
              variant='outlined'
            >Go Home</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LogoutPage;
