import React, { useEffect, useState } from 'react';

import './style.css';
import Button from '../Button/Button';

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
        <p>Are you sure to delete {type}?</p>
        <div className="buttons">
          <Button
            aria-label="ok deleteing account"
            onClick={onOk}
            className="ok"
            variant='contained'
            color="main"
          >Delete</Button>
          <Button
            aria-label="cancel deleteing account"
            onClick={onCancel}
            className="cancel"
            variant='outlined'
          >cancel</Button>
        </div>
      </div>
    </div>
  );
}

export default DeletePopup;
