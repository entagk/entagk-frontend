import React from 'react';

import './style.css'

function NetworkError() {
  return (
    <div className='network-error'>
      <h2>There is no Internet Connection, try again later.</h2>
    </div>
  );
}

export default NetworkError;
