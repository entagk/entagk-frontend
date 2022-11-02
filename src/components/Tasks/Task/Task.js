import React, { lazy, Suspense, useState } from "react";

import { BsCheckCircleFill } from 'react-icons/bs';

import { FiEdit3 } from 'react-icons/fi';
import { MdDelete, MdRadioButtonUnchecked } from 'react-icons/md';
import { useDispatch, useSelector } from "react-redux";
import { checkTask, deleteTask, CHANGE_ACTIVE_TASK } from "../../../actions/tasks";
import Message from "../../../utils/Message";
// import Loading from "../../../Utils/Loading";

const TaskForm = lazy(() => import("../TaskForm/TaskForm"));

const Task = (props) => {
  const dispatch = useDispatch();
  const { activeId } = useSelector(state => state.tasks);
  const { setting } = useSelector(state => state.timer);
  // const {active, activites} = useSelector(state => state.timer);
  const [message, setMessage] = useState({type: "", message: ""});
  const [openEdit, setOpenEdit] = useState(false);

  const handleCheck = () => {
    dispatch(checkTask(props.id, setMessage));
  }

  const handleDelete = () => {
    dispatch(deleteTask(props.id, setMessage));
  }

  const handleActive = () => {
    if ((!props.check && setting.autoStartNextTask) || (!setting.autoStartNextTask && props.act !== props.est)) {
      dispatch({ type: CHANGE_ACTIVE_TASK, data: { id: props.id, name: props.name } });
    }
  }

  if (openEdit) {
    return (
      <Suspense fallback={<div>loading...</div>}>
        <TaskForm oldData={props} setOpen={setOpenEdit} />
      </Suspense>
    )
  }

  return (
    <div>
      <>
        {message.message && (
          <Message message={message.message} type={message.type} setMessage={setMessage} />
        )}
      </>
      <div className={`task ${activeId === props.id && "active"}`} onClick={handleActive}>
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
            <button aria-label="edit button" onClick={() => setOpenEdit(oe => !oe)}><FiEdit3 /></button>
            <button aria-label="delet button" onClick={handleDelete}><MdDelete /></button>
          </div>
        </div>
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
            <p style={{ textDecoration: props.check && "line-through" }}>{props.name}</p>
          </div>
          <p className="act-est"><span>{props.act}</span> / <span>{props.est}</span></p>
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