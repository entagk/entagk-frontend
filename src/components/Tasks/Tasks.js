import React, { lazy, Suspense, useEffect, useState } from "react";

import { AiOutlinePlus } from 'react-icons/ai';
import { useDispatch, useSelector } from "react-redux";
import { getTasks } from "../../actions/tasks";
import Loading from "../../utils/Loading";
import Message from "../../utils/Message";

import "./style.css";

const TaskForm = lazy(() => import("./TaskForm/TaskForm"));
const Footer = lazy(() => import("./TaskFooter/TaskFooter"));
const Menu = lazy(() => import("./TasksMenu/TasksMenu"));
const Task = lazy(() => import("./Task/Task"));

const Tasks = () => {
  const [openFormForNew, setOpenFormForNew] = useState(false);
  const { tasks } = useSelector(state => state.tasks);
  const { active, activites, setting, started } = useSelector(state => state.timer);
  const dispatch = useDispatch();
  const [message, setMessage] = useState({ type: '', message: "" });

  useEffect(() => {
    if (tasks === undefined) {
      dispatch(getTasks(setMessage));
    }
    // eslint-disable-next-line
  }, [tasks]);

  if (tasks === undefined) {
    return (
      <Loading
        size="200"
        strokeWidth="1"
        backgroud="white"
        color={activites[active].color}
      />
    )
  }

  return (
    <>
      {message.message && (
        <Message {...message} setMessage={setMessage} />
      )}
      <Suspense fallback={
        <Loading
          size="200"
          strokeWidth="1"
          backgroud="white"
          color={activites[active].color}
        />
      }>
        <div className="tasks" style={{ display: (setting?.focusMode && started) && "none" }}>
          <div className="header">
            <h2>
              Tasks
            </h2>
            <Menu />
          </div>
          <div className="tasks-container">
            {tasks?.length > 0 && (
              <div className="tasks-list">
                {tasks?.map((task, index) => (
                  <Suspense fallback={<div>loading...</div>} key={task.id}>
                    <Task key={task.id} {...task} />
                  </Suspense>
                ))}
              </div>
            )}
            {!openFormForNew ? (
              <button aria-label="add task button" className="add-task-button" onClick={() => setOpenFormForNew(p => !p)}>
                <AiOutlinePlus size="25px" />
                <p style={{ marginLeft: 10 }}>
                  add task
                </p>
              </button>
            ) : (
              <Suspense fallback={<div>loading...</div>}>
                <TaskForm setOpen={setOpenFormForNew} oldData={null} />
              </Suspense>
            )}
          </div>
          {tasks?.length > 0 && (
            <div className="footer-container">
              <Footer />
            </div>
          )}
        </div>
      </Suspense>
    </>
  )
};

export default Tasks;