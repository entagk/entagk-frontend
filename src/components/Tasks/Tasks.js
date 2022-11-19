import React, { lazy, Suspense, useEffect, useState } from "react";

import { AiOutlinePlus } from 'react-icons/ai';
import { useDispatch, useSelector } from "react-redux";
import { getTasks } from "../../actions/tasks";
import Loading from "../../utils/Loading";

import "./style.css";

const TaskForm = lazy(() => import("./TaskForm/TaskForm"));
const Footer = lazy(() => import("./TaskFooter/TaskFooter"));
const Menu = lazy(() => import("./TasksMenu/TasksMenu"));
const Task = lazy(() => import("./Task/Task"));

const Tasks = ({ setMessage }) => {
  const [openFormForNew, setOpenFormForNew] = useState(false);
  const tasks = useSelector(state => state.tasks);
  const { active, activites, setting, started } = useSelector(state => state.timer);
  const dispatch = useDispatch();
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
        color={activites[active]?.color}
      />
    )
  }

  return (
    <>
      <Suspense fallback={
        <Loading
          size="200"
          strokeWidth="5"
          color="white"
          backgroud="transparent"
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
                  <Loading size="50" strokeWidth="3" color={"#fff"} backgroud="transparent" />
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
                          <Loading size="50" strokeWidth="3" color={"#fff"} backgroud="transparent" />
                        </div>
                      } key={task._id}>
                        <Task key={task._id} isLoading={isLoading} setIsLoading={setIsLoading} setMessage={setMessage} {...task} />
                      </Suspense>
                    ))}
                    {
                      <div className="loading-container">
                        <Loading size="50" strokeWidth="3" color={"#fff"} backgroud="transparent" />
                      </div>
                    }
                    {tasks.tasks?.filter(t => t.check)?.map((task, index) => (
                      <Suspense fallback={
                        <div className="loading-container">
                          <Loading size="50" strokeWidth="3" color={"#fff"} backgroud="transparent" />
                        </div>
                      } key={task._id}>
                        <Task key={task._id} isLoading={isLoading} setIsLoading={setIsLoading} setMessage={setMessage} {...task} />
                      </Suspense>
                    ))}
                  </>
                ) : (
                  <>
                    {tasks.tasks?.map((task, index) => (
                      <Suspense fallback={
                        <div className="loading-container">
                          <Loading size="50" strokeWidth="3" color={"#fff"} backgroud="transparent" />
                        </div>
                      } key={task?._id}>
                        <Task key={task?._id} isLoading={isLoading} setIsLoading={setIsLoading} setMessage={setMessage} {...task} />
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
                  <Loading size="60" strokeWidth="5" color={"#fff"} backgroud="transparent" />
                </div>
              }>
                <TaskForm setOpen={setOpenFormForNew} oldData={null} isLoading={isLoading} setIsLoading={setIsLoading} setMessage={setMessage} />
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