import React, { useEffect, useState } from 'react';

import './style.css';

function DeletePopup({
  type,
  onOk,
  onCancel
}) {
  const [background, setBackground] = useState(false);

  useEffect(() => {
    if (document.querySelectorAll('.glass-container').length > 1) {
      setBackground(true);
    }
  }, []);

  return (
    <div className="glass-container" style={{ background: background && "none" }}>
      <div className="glass-effect delete-popup">
        <p>Are you sure to {type}?</p>
        <div className="buttons">
          <button aria-label="ok deleteing account" onClick={onOk} className="ok">Delete</button>
          <button aria-label="cancel deleteing account" onClick={onCancel} className="cancel">cancel</button>
        </div>
      </div>
    </div>
  );
}

export default DeletePopup;
