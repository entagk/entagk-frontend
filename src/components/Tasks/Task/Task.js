import React, { lazy, Suspense, useState } from "react";

import { BsCheckCircleFill } from 'react-icons/bs';

import { FiEdit3 } from 'react-icons/fi';
import { MdDelete, MdRadioButtonUnchecked } from 'react-icons/md';
import { useDispatch, useSelector } from "react-redux";
import { checkTask, deleteTask, CHANGE_ACTIVE_TASK } from "../../../actions/tasks";
import Message from "../../../Utils/Message";
import Loading from "../../../Utils/Loading";

const TaskForm = lazy(() => import("../TaskForm/TaskForm"));

const Task = (props) => {
  const dispatch = useDispatch();
  const { activeId } = useSelector(state => state.tasks);
  const {active, activites} = useSelector(state => state.timer);
  const [error, setError] = useState();
  const [openEdit, setOpenEdit] = useState(false);

  const handleCheck = () => {
    dispatch(checkTask(props.id, setError));
  }

  const handleDelete = () => {
    dispatch(deleteTask(props.id, setError));
  }

  const handleActive = () => {
    dispatch({ type: CHANGE_ACTIVE_TASK, data: { id: props.id, name: props.name } });
  }

  if (openEdit) {
    return (
      <Suspense fallback={<Loading color={activites[active].color} background="#fff" />}>
        <TaskForm oldData={props} setOpen={setOpenEdit} />
      </Suspense>
    )
  }

  return (
    <div>
      {error && (
        <Message message={`error: ${error} at task ${props.name}`} type="error" setMessage={setError} />
      )}
      <div className={`task ${activeId === props.id && "active"}`} onClick={handleActive}>
        <div className="overflow">
          <div className="buttons">
            <button aria-label="check button" onClick={handleCheck}>
              {props.check ? (
                <BsCheckCircleFill />
              ) : (
                <MdRadioButtonUnchecked />
              )}
            </button>
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
        {/* <div><FiEdit3 /></div> */}
      </div>
    </div>
  )
};

export default Task;