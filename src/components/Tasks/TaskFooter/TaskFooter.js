import React from "react";
import { useSelector } from "react-redux";

const Footer = ({ activeTemplate }) => {
  const { est, act } = useSelector(state => state.tasks);
  const template = useSelector(state => state.tasks.tasks.find(t => t._id === activeTemplate?._id))
  return (
    <div className="footer-container">
      <div className="footer">
        <p>
          {activeTemplate?._id ? 'est' : 'all'}:
          <span>{activeTemplate?._id ? template?.est : est}</span>
        </p>
        <p>
          {activeTemplate?._id ? 'act' : 'finished'}:
          <span>{activeTemplate?._id ? template?.act : act}</span>
        </p>
      </div>
    </div>
  )
}

export default Footer;
