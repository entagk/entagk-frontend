import React, { useState } from 'react';
import { BiShow, BiHide } from 'react-icons/bi';
import Button from '../../../utils/Button/Button';

import './style.css';

function Password({
  formData,
  handleChange,
  onBlur,
  name,
  placeholder
}) {
  const [show, setShow] = useState(false);

  return (
    <div className="password">
      <input
        name={name}
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={formData[name]}
        className={formData.password !== formData.confirmPassword && name === 'confirmPassword' ? 'error' : undefined}
        onChange={handleChange}
        onBlur={onBlur}
      />
      <Button
        variant='single-icon'
        type="button"
        aria-label="toggle password showing"
        className="icon"
        onClick={() => setShow(pS => !pS)}
        startIcon={
          <>
            {show ? (
              <BiHide />
            ) : (
              <BiShow />
            )}
          </>
        }
      />
    </div>
  );
}

export default Password;
