import React, { lazy, Suspense, useState } from "react";

import { BsCheckCircleFill } from 'react-icons/bs';

import { FiEdit3 } from 'react-icons/fi';
import { MdDelete, MdRadioButtonUnchecked } from 'react-icons/md';
import { useDispatch, useSelector } from "react-redux";
import { checkTask, deleteTask, CHANGE_ACTIVE_TASK } from "../../../actions/tasks";
import Loading from "../../../utils/Loading";

const TaskForm = lazy(() => import("../TaskForm/TaskForm"));

const Task = ({ isLoading, setIsLoading, setMessage, ...props }) => {
  const dispatch = useDispatch();
  const { activeId } = useSelector(state => state.tasks);
  const { setting } = useSelector(state => state.timer);
  const [openEdit, setOpenEdit] = useState(false);

  const handleCheck = () => {
    dispatch(checkTask(props._id, setIsLoading, setMessage));
  }

  const handleDelete = () => {
    dispatch(deleteTask(props._id, setIsLoading, setMessage));
  }

  const handleActive = () => {
    if ((!props.check && setting.autoStartNextTask) || (!setting.autoStartNextTask && props.act !== props.est)) {
      if (activeId === props._id) {
        dispatch({ type: CHANGE_ACTIVE_TASK, data: {} });
      } else if(activeId !== props._id) {
        dispatch({ type: CHANGE_ACTIVE_TASK, data: props });
      }
    }
  }

  if (openEdit) {
    return (
      <Suspense fallback={<Loading size="40" strokeWidth="3" color={"rgb(197 197 197)"} />}>
        <TaskForm oldData={props} setOpen={setOpenEdit} isLoading={isLoading} setIsLoading={setIsLoading} />
      </Suspense>
    )
  }

  return (
    <div>
      <div
        className={`task ${activeId === props._id ? "active" : ''}`}
        onClick={handleActive}>
        {isLoading === props._id ? (
          <div className="loading-container">
            <Loading size="40" strokeWidth="3" color={"rgb(197 197 197)"} />
          </div>
        ) : (
          <div className="overflow">
            <div className="buttons">
              {!setting.autoStartNextTask && (
                <button aria-label="check button" onClick={handleCheck}>
                  {props.check ? (
                    <BsCheckCircleFill />
                  ) : (
                    <MdRadioButtonUnchecked />
                  )}
                </button>
              )}
              <button
                aria-label="edit button"
                onClick={() => setOpenEdit(oe => !oe)}
              ><FiEdit3 /></button>
              <button
                aria-label="delet button"
                onClick={handleDelete}
              ><MdDelete /></button>
            </div>
          </div>
        )}
        <div style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          justifyContent: "space-between"
        }}>
          <div className="task-inner">
            <div className="icon-container">
              {props.check ? (
                <BsCheckCircleFill className="task-uncheck" />
              ) : (
                <MdRadioButtonUnchecked className="task-check" />
              )}
            </div>
            <p style={{
              textDecoration: props.check && "line-through"
            }}>{props.name}</p>
          </div>
          <p className="act-est">
            <span>{props.act}</span>
            <span style={{
              fontWeight: "normal",
              fontSize: "18px",
              marginInline: "4px"
            }}>/</span>
            <span>{props.est}</span>
          </p>
        </div>
        {props.notes !== '' && (
          <div className="task-notes">
            <p>{props.notes}</p>
          </div>
        )}
      </div>
    </div>
  )
};

export default Task;
