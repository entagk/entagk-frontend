import React from 'react';
import { Link } from 'react-router-dom';

import Button from '../../utils/Button/Button';

import './style.css';

function NoLogin() {
  const reload = () => {
    window.location.reload();
  }

  return (
    <div className='no-login'>
      <div className='container'>
        <div>
          <h1>Please, Login to use this feature</h1>
        </div>
        <div className='buttons'>
          {window.location.pathname === '/' ? (
            <Button
              variant='contained'
              onClick={reload}
              style={{
                marginInline: 20
              }}
            >
              reload
            </Button>
          ) : (
            <Button
              component={Link}
              to="/"
              variant='contained'
            >
              go home
            </Button>
          )}
          {(window.location.pathname === '/' || window.history.length > 2) && (
            <Button
              component={Link}
              to={-1}
              variant='outlined'
            >
              go back
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default NoLogin;
