import React, { useState } from 'react';
import { BiShow, BiHide } from 'react-icons/bi';
import Button from '../../../utils/Components/Button/Button';

import './style.css';

function Password({
  formData,
  name,
  formErrors,
  ...props
}) {
  const [show, setShow] = useState(false);

  return (
    <div className="password">
      <input
        name={name}
        value={formData[name]}
        className={formErrors[name] ? 'error' : undefined}
        {...props}
        type={show ? "text" : "password"}
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
