import React from 'react';
import NoIntenet from '../../icons/NoInternet/NoIntenet';

import './style.css'
import Button from '../../utils/Components/Button/Button';

function NetworkError() {
  const reload = () => {
    window.location.reload();
  }

  return (
    <div className='network-error'>
      <NoIntenet />
      <h2>There is no Internet Connection, try again later.</h2>
      <div>
        <Button
          aria-label='reload button'
          onClick={reload}
        >
          reload
        </Button>
      </div>
    </div>
  );
}

export default NetworkError;
