import React from "react";
import { useSelector } from "react-redux";

const ActiveTask = () => {
  const { periodNum } = useSelector(state => state.timer);
  const { activeId, activeName } = useSelector(state => state.tasks);

  return (
    <div className="active-task" style={{ marginBlock: 20 }}>
      <span style={{
        fontSize: "16px",
        color: "rgb(255 255 255)", 
        textShadow: "0 0 2px #878787"
      }}>#{periodNum + 1}</span>
      <span style={{ 
        color: "rgb(237 237 237)",
        fontWeight: 600,
        textTransform: "capitalize"
      }}>{activeId === null ? "please focus on what you are doing now" : activeName}</span>
    </div>
  )
}

export default ActiveTask;