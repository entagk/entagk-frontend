import React, { useEffect } from "react";

import { AiFillCheckCircle, AiFillCloseCircle } from "react-icons/ai";
import { BiError } from "react-icons/bi";
import Button from "./Button/Button";

const Message = ({ message, type, setMessage }) => {
  useEffect(() => {
    if (message && !message === 'Network Error') {
      setTimeout(() => {
        setMessage({ message: "", type: '' });
      }, 10000);
    }
    // eslint-disable-next-line
  }, [message]);

  return (
    <div className="message-container" style={{ background: type === 'success' && '#00ae00' }}>
      <div>
        {type === 'error' ? <BiError /> : <AiFillCheckCircle />}
      </div>
      <div>{message}</div>
      <Button
        aria-label="Close error"
        type='button'
        onClick={() => setMessage({ message: "", type: '' })}
        variant="single-icon"
        style={{
          padding: 0
        }}
      ><AiFillCloseCircle /></Button>
    </div>
  )
};

export default Message;
