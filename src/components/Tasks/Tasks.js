import React, { lazy, Suspense, useEffect, useState } from "react";

import { AiOutlinePlus } from 'react-icons/ai';
import { useDispatch, useSelector } from "react-redux";
import { getTasks } from "../../actions/tasks";

const NewForm = lazy(() => import("./NewForm/NewForm"));
const Footer = lazy(() => import("./TaskFooter/TaskFooter"));
const Menu = lazy(() => import("./TasksMenu/TasksMenu"));
const Task = lazy(() => import("./Task/Task"));

const Tasks = () => {
  const dispatch = useDispatch();
  const [openFormForNew, setOpenFormForNew] = useState(false);
  const { tasks } = useSelector(state => state.tasks);

  useEffect(() => {
    if (!tasks) {
      dispatch(getTasks());
    }
    // eslint-disable-next-line
  }, [tasks])

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <div className="tasks">
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
                <Task key={index} {...task} />
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
            <Suspense fallback={<div>Loading...</div>}>
              <NewForm setOpen={setOpenFormForNew} oldData={null} />
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
  )
};

export default Tasks;