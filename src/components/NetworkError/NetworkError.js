import React from 'react';
import NoIntenet from '../../icons/NoInternet/NoIntenet';

import './style.css'

function NetworkError() {
  const reload = () => {
    window.location.reload();
  }

  return (
    <div className='network-error'>
      <NoIntenet />
      <h2>There is no Internet Connection, try again later.</h2>
      <div>
        <button aria-label='reload button' onClick={reload}>reload</button>
      </div>
    </div>
  );
}

export default NetworkError;
