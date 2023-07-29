import React from 'react';

import './style.css'
import Button from '../Button/Button';

function DeletePopupSmaller({ type, onOk, onCancel }) {
  return (
    <div
      className='delete-popup smaller-popup'
    >
      <p>Are you sure to delete {type} ?</p>
      <div>
        <div className="buttons">
          <Button
            aria-label="ok deleteing account"
            onClick={onOk} className="ok"
            color="main"
          >Delete</Button>
          <Button
            aria-label="cancel deleteing account"
            onClick={onCancel}
            className="cancel"
            variant="outlined"
            style={{color: '#000'}}
          >Cancel</Button>
        </div>
      </div>
    </div>
  );
}

export default DeletePopupSmaller;
