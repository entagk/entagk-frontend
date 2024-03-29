import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { CHANGE_ACTIVE_TASK } from "../../actions/tasks";
import { FiEdit3 } from "react-icons/fi";

import "./style.css";
import Button from "../../utils/Components/Button/Button";

const ActiveTask = () => {
  const { periodNum } = useSelector(state => state.timer);
  const { activeId, activeName } = useSelector(state => state.tasks);
  const dispatch = useDispatch();

  const unactive = () => {
    dispatch({ type: CHANGE_ACTIVE_TASK, data: {} });
  }

  return (
    <div className="active-task">
      <span className="row1">#{periodNum + 1}</span>
      <span className="row2">
        {!Boolean(activeId) ? "please focus on what you are doing now" : activeName}
        {Boolean(activeId) && (
          <Button
            variant="single-icon"
            className="unactive"
            onClick={unactive}
            aria-label="unactive the task"
            startIcon={<FiEdit3 />}
          />
        )}
      </span>
    </div>
  )
}

export default ActiveTask;
