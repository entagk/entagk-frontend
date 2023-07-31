import React from 'react';

import "./style.css";

function ToggleButton({ type, data, setData }) {
  const handleChange = () => {
    if (typeof data === 'boolean') {
      setData(d => !d);
    } else {
      setData({ ...data, [type]: !data[type] });
    }
  }

  const open = () => typeof data === 'boolean' ? data : data[type]

  return (
    <div className='toggle-button-container'>
      <div
        className='toggle-button'
        onClick={handleChange}
        style={{
          justifyContent: open() ? "flex-end" : "flex-start", // false -->> flex-start, true -->> flex-end
          background: open() ? "rgb(0 255 141 / 85%)" : "rgb(236 236 236 / 37%)", // false -->> rgb(236 236 236), true -->> #00ff8d
        }}>
        <div className='toggle-point'></div>
      </div>
    </div>
  );
}

export default ToggleButton;
