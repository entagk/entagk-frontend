import React from 'react';

import './style.css'

function NetworkError(props) {
  return (
    <div className='newtwork-error'>
      <h2>There is no Internet Connection</h2>
    </div>
  );
}

export default NetworkError;