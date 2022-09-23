import React from "react";
import { useSelector } from "react-redux";

const ActiveTask = () => {
  const { periodNum } = useSelector(state => state.timer);
  const { activeId, activeName } = useSelector(state => state.tasks);

  return (
    <div className="active-task" style={{ marginBlock: 20 }}>
      <span style={{
        fontSize: "16px",
        color: "rgb(182 181 181)", 
        textShadow: "0 0 2px #878787"
      }}>#{periodNum + 1}</span>
      <span style={{ 
        color: "#e7e7e7",
        fontWeight: 600 
      }}>{activeId === null ? "Please Focus on your work" : activeName}</span>
    </div>
  )
}

export default ActiveTask;