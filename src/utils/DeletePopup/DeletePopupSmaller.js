import React from 'react';

import './style.css'

function DeletePopupSmaller({ type, onOk, onCancel }) {
  return (
    <div
      className='delete-popup smaller-popup'
    >
      <p>Are you sure to delete {type} ?</p>
      <div>
        <div className="buttons">
          <button aria-label="ok deleteing account" onClick={onOk} className="ok">Delete</button>
          <button aria-label="cancel deleteing account" onClick={onCancel} className="cancel">cancel</button>
        </div>
      </div>
    </div>
  );
}

export default DeletePopupSmaller;
