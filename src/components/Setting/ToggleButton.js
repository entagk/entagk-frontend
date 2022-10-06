import React from 'react';

function ToggleButton({ type, data, setData }) {
  const handleChange = () => {
    setData({...data, [type]: !data[type]});
  }

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end"
    }}>
      <div
      onClick={handleChange} 
      style={{
        width: "60px",
        height: "32px",
        display: "flex",
        justifyContent: data[type] ? "flex-end" : "flex-start", // false -->> flex-start, true -->> flex-end
        alignItems: "center",
        padding: "2px", 
        borderRadius: "30px",
        cursor: "pointer",
        background: data[type] ? "#00ff8d" : "rgb(236 236 236)", // false -->> rgb(236 236 236), true -->> #00ff8d
      }}>
        <div style={{
          width: "50%",
          height: "100%",
          background: "white",
          borderRadius: "50px"
        }}></div>
      </div>
    </div>
  );
}

export default ToggleButton;