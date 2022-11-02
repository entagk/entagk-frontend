import React from "react";
import { useSelector } from "react-redux";

const Footer = () => {
  const { est, act } = useSelector(state => state.tasks);
  return (
    <div className="footer">
      <p>all: <span>{est}</span></p>
      <p>
        finished: <span>{act}</span>
      </p>
    </div>
  )
}

export default Footer;