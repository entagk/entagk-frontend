import React from 'react';

import './style.css';

function DeletePopup({
  type,
  onOk,
  onCancel
}) {
  return (
    <div className="glass-container" style={{ background: (type?.props?.children?.includes("task") || type?.props?.children?.includes("template")) && "none" }}>
      <div className="glass-effect delete-popup">
        <p>Are you sure to delete {type}?</p>
        <div className="buttons">
          <button aria-label="ok deleteing account" onClick={onOk} className="ok">Delete</button>
          <button aria-label="cancel deleteing account" onClick={onCancel} className="cancel">cancel</button>
        </div>
      </div>
    </div>
  );
}

export default DeletePopup;
