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
  const tasks = useSelector(state => state.tasks);
  const { active, activites, setting, started } = useSelector(state => state.timer);
  const dispatch = useDispatch();
  const [message, setMessage] = useState({ type: '', message: "" });
  const [isLoading, setIsLoading] = useState(null);

  useEffect(() => {
    if (tasks.tasks === undefined) {
      dispatch(getTasks(setMessage));
    }
    // eslint-disable-next-line
  }, [tasks.tasks]);

  if (tasks.tasks === undefined) {
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
            <>
              {(tasks.isLoading && tasks.tasks.length > 0) && (
                <div className="loading-container">
                  <Loading size="50" strokeWidth="5" backgroud={'transparent'} color="rgb(220 220 220)" />
                </div>
              )}
            </>
            {tasks.tasks?.length > 0 && (
              <div className="tasks-list">
                {isLoading === 'new' ? (
                  <>
                    {tasks.tasks?.filter(t => !t.check)?.map((task, index) => (
                      <Suspense fallback={
                        <div className="loading-container">
                          <Loading size="40" strokeWidth="3" color={"rgb(197 197 197)"} />
                        </div>
                      } key={task._id}>
                        <Task key={task._id} isLoading={isLoading} setIsLoading={setIsLoading} {...task} />
                      </Suspense>
                    ))}
                    {
                      <div className="loading-container">
                        <Loading size="40" strokeWidth="3" color={"rgb(197 197 197)"} />
                      </div>
                    }
                    {tasks.tasks?.filter(t => t.check)?.map((task, index) => (
                      <Suspense fallback={
                        <div className="loading-container">
                          <Loading size="40" strokeWidth="3" color={"rgb(197 197 197)"} />
                        </div>
                      } key={task._id}>
                        <Task key={task._id} isLoading={isLoading} setIsLoading={setIsLoading} {...task} />
                      </Suspense>
                    ))}
                  </>
                ) : (
                  <>
                    {tasks.tasks?.map((task, index) => (
                      <Suspense fallback={
                        <div className="loading-container">
                          <Loading size="40" strokeWidth="3" color={"rgb(197 197 197)"} />
                        </div>
                      } key={task._id}>
                        <Task key={task._id} isLoading={isLoading} setIsLoading={setIsLoading} {...task} />
                      </Suspense>
                    ))}
                  </>
                )}
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
              <Suspense fallback={
                <div className="loading-container">
                  <Loading size="60" strokeWidth="5" color={"#fff"} />
                </div>
              }>
                <TaskForm setOpen={setOpenFormForNew} oldData={null} isLoading={isLoading} setIsLoading={setIsLoading} />
              </Suspense>
            )}
          </div>
          {tasks.tasks?.length > 0 && (
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