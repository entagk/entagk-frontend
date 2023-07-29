import React from 'react';
import { BiShow, BiHide } from 'react-icons/bi';
import Button from '../../utils/Button/Button';

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
      <Button
        variant='single-icon'
        type="button"
        aria-label="toggle password showing"
        className="icon"
        onClick={() => onClick(type)}
        startIcon={
          <>
            {passowordShow[type] ? (
              <BiHide />
            ) : (
              <BiShow />
            )}
          </>
        }
      >
      </Button>
    </div>
  );
}

export default Password;
