import React, { lazy, Suspense, useEffect, useState } from 'react';

import { AiOutlinePlus } from 'react-icons/ai';
import { getTodoTasks } from '../../actions/tasks';

import Loading from '../../utils/Loading';

import "./style.css"
import { useDispatch, useSelector } from 'react-redux';
const Task = lazy(() => import('../Tasks/Task/Task'));
const TaskForm = lazy(() => import('../Tasks/TaskForm/TaskForm'));

const Template = ({ todoTemplate, isLoading, setIsLoading, setMessage }) => {
  const dispatch = useDispatch();
  // const [tasks, setTasks] = useState([]);
  const { tasks, currentPage, numberOfPages } = useSelector(state => state.tasks).tempTasks[todoTemplate._id];
  const [openFormForNew, setOpenFormForNew] = useState(false);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [showTasks, setShowTasks] = useState(false);

  useEffect(() => {
    (async () => {
      if (tasks === undefined) {
        dispatch(getTodoTasks(todoTemplate._id, 1, setLoadingTasks, setIsLoading, setMessage));
      }
    })();
    // eslint-disable-next-line
  }, [tasks])

  return (
    <div className='todo-temp' style={{
      background: todoTemplate.color
    }}>
      <Suspense fallback={
        <div className="loading-container">
          <Loading size="50" strokeWidth="3" color={"#fff"} backgroud="transparent" />
        </div>
      }>
        <Task isLoading={isLoading} setIsLoading={setIsLoading} setMessage={setMessage} setShowTasks={setShowTasks} {...todoTemplate} />
        {showTasks && (
          <>
            <div className='temp-tasks'>
              {(loadingTasks && tasks.length === 0) ? (
                <>
                  <div className="loading-container">
                    <Loading size="50" strokeWidth="3" color={"#fff"} backgroud="transparent" />
                  </div>
                </>
              ) : (
                <>
                  {
                    tasks.map((task) => (
                      <Task key={task._id} isLoading={isLoading} setIsLoading={setIsLoading} setMessage={setMessage} {...task} />
                    ))
                  }
                </>
              )}
              {currentPage !== numberOfPages && (
                <>
                  <div className='loadBtn-container'>
                    <button onClick={() => dispatch(getTodoTasks(todoTemplate._id, currentPage + 1, setLoadingTasks, setIsLoading, setMessage))}>
                      load more
                    </button>
                  </div>
                </>
              )}
              {(isLoading && tasks.length > 0) && (
                <div className="loading-container">
                  <Loading size="50" strokeWidth="3" color={"#fff"} backgroud="transparent" />
                </div>
              )}
              <Suspense fallback={
                <div className="loading-container">
                  <Loading size="60" strokeWidth="5" color={"#fff"} backgroud="transparent" />
                </div>
              }>
                {openFormForNew && (
                  <Suspense fallback={
                    <div className="loading-container">
                      <Loading size="60" strokeWidth="5" color={"#fff"} backgroud="transparent" />
                    </div>
                  }>
                    <TaskForm setOpen={setOpenFormForNew} oldData={null} template={{ "_id": todoTemplate._id }} isLoading={isLoading} setIsLoading={setIsLoading} setMessage={setMessage} />
                  </Suspense>
                )}
              </Suspense>
            </div>
            {!openFormForNew && (
              <button aria-label="add task button" className="add-task-button" onClick={() => setOpenFormForNew(p => !p)}>
                <AiOutlinePlus size="25px" />
                <p style={{ marginLeft: 10 }}>
                  add task
                </p>
              </button>
            )}
          </>
        )}
      </Suspense>
    </div>
  );
};

export default Template;
