import React from 'react';
import Loading from '../Loading';

function DeletePopupLoading(props) {
  return (
    <div className="glass-container" style={{ background: background && "none" }}>
      <div className="glass-effect delete-popup">
        <Loading />
      </div>
    </div>
  );
}

export default DeletePopupLoading;
