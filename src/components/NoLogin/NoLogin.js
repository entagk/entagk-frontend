import React from 'react';
import { Link } from 'react-router-dom';

import './style.css';

function NoLogin() {
  return (
    <div className='no-login'>
      <div className='container'>
        <div>
          <h1>Please, Login to use this feature</h1>
        </div>
        <div className='buttons'>
          <Link to="/">
            go home
          </Link>
          <Link to="/auth">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NoLogin;
