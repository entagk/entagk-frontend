import React from 'react';
import { BiShow, BiHide } from 'react-icons/bi';

function Password({ passowordShow, formData, handleChange, onClick, type }) {
  return (
    <div className="password">
      <input
        name={type}
        type={passowordShow[type] ? "text" : "password"}
        placeholder={type}
        value={formData[type]}
        className={formData.password !== formData.confirmPassword && type === 'confirmPassword' ? 'error' : undefined}
        onChange={handleChange}
      />
      <button
        type="button"
        aria-label="toggle password showing"
        className="icon"
        onClick={() => onClick(type)}
      >
        {passowordShow[type] ? (
          <BiHide />
        ) : (
          <BiShow />
        )}
      </button>
    </div>
  );
}

export default Password;