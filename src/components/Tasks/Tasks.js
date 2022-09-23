import React, { useEffect, useState } from "react";

import { AiOutlinePlus } from 'react-icons/ai';
import { useDispatch, useSelector } from "react-redux";
import { getTasks } from "../../actions/tasks";

import NewForm from "./NewForm/NewForm";
import Footer from "./TaskFooter/TaskFooter";
import Menu from "./TasksMenu/TasksMenu";
import Task from "./Task/Task";

const Tasks = () => {
  const dispatch = useDispatch();
  const [openFormForNew, setOpenFormForNew] = useState(false);
  const { tasks } = useSelector(state => state.tasks);

  useEffect(() => {
    if(!tasks) {
      dispatch(getTasks());
    }
    // eslint-disable-next-line
  }, [tasks])

  return (
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
          <NewForm setOpen={setOpenFormForNew} oldData={null} />
        )}
      </div>
      {tasks?.length > 0 && (
        <div className="footer-container">
          <Footer />
        </div>
      )}
    </div>
  )
};

export default Tasks;