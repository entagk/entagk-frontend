import React from 'react';
import { Link } from 'react-router-dom';

import Button from '../../utils/Components/Button/Button';

import './style.css';

function NoLogin() {
  return (
    <div className='no-login'>
      <div className='container'>
        <div>
          <h1>Please, Login to use this feature</h1>
        </div>
        <div className='buttons'>
          <Button
            component={Link}
            to="/auth"
            style={{
              marginInline: 20
            }}
          >
            login
          </Button>
          <Button
            variant='outlined'
            component={Link}
            to="/"
          >
            go home
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NoLogin;
