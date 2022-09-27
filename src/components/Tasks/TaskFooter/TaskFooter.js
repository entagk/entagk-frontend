import React from "react";
import { useSelector } from "react-redux";

const Footer = () => {
  const { est, act } = useSelector(state => state.tasks);
  return (
    <div className="footer">
      <p>est: <span>{est}</span></p>
      <p>
        act: <span>{act}</span>
      </p>
    </div>
  )
}

export default Footer;