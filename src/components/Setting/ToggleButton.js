import React from 'react';

function ToggleButton({ type, data, setData }) {
  const handleChange = () => {
    setData({ ...data, [type]: !data[type] });
  }

  return (
    <div className='toggle-button-container'>
      <div
        className='toggle-button'
        onClick={handleChange}
        style={{
          justifyContent: data[type] ? "flex-end" : "flex-start", // false -->> flex-start, true -->> flex-end
          background: data[type] ? "rgb(0 255 141 / 85%)" : "rgb(236 236 236 / 37%)", // false -->> rgb(236 236 236), true -->> #00ff8d
        }}>
        <div className='toggle-point'></div>
      </div>
    </div>
  );
}

export default ToggleButton;
