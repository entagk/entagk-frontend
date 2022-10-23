import React, { lazy, Suspense, useState } from "react";

import { AiOutlinePlus } from 'react-icons/ai';
import { useSelector } from "react-redux";
import Loading from "../../utils/Loading";

import "./style.css";

const TaskForm = lazy(() => import("./TaskForm/TaskForm"));
const Footer = lazy(() => import("./TaskFooter/TaskFooter"));
const Menu = lazy(() => import("./TasksMenu/TasksMenu"));
const Task = lazy(() => import("./Task/Task"));

const Tasks = () => {
  const [openFormForNew, setOpenFormForNew] = useState(false);
  const { tasks } = useSelector(state => state.tasks);
  const { active, activites, setting, started } = useSelector(state => state.timer);

  return (
    <>
      <Suspense fallback={
        <Loading backgroud="transparent" width="100" height="100" cx="25" cy="25" r="20" strokeWidth="1" color={activites[active].color} />
      }>
        <div className="tasks" style={{display: (setting.focusMode && started) && "none" }}>
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