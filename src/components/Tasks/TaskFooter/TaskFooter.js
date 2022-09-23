import React from "react";
import { useSelector } from "react-redux";

const Footer = () => {
  const { est, act, finishing } = useSelector(state => state.tasks);
  return (
    <div className="footer">
      <p>est: <span>{est}</span></p>
      <p>
        act: <span>{act}</span>
      </p>
      <p>
        finished at : <span>{finishing}</span>   
      </p>
    </div>
  )
}

export default Footer;