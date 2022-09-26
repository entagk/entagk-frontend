import React, { useEffect } from "react";

import { AiFillCheckCircle, AiFillCloseCircle } from "react-icons/ai";
import { BiError } from "react-icons/bi";

const Message = ({ message, type, setMessage }) => {
  useEffect(() => {
    if (message) {
      setTimeout(() => {
        setMessage("");
      }, 5000);
    }
    // eslint-disable-next-line
  }, [message]);

  return (
    <div className="message-container">
      <div>
        {type === 'error' ? <BiError /> : <AiFillCheckCircle />}
      </div>
      <div>{message}</div>
      <button aria-label="Close error" onClick={() => setMessage("")}><AiFillCloseCircle /></button>
    </div>
  )
};

export default Message;