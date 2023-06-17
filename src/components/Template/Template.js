import React, { lazy, Suspense, useEffect, useState } from 'react';

import { AiOutlinePlus } from 'react-icons/ai';
import { getTodoTasks } from '../../actions/tasks';

import Loading from '../../utils/Loading';

import Message from "../../utils/Message";
import NetworkError from "../NetworkError/NetworkError";

import "./style.css";
import { useDispatch, useSelector } from 'react-redux';

const Task = lazy(() => import('../Tasks/Task/Task'));
const TaskForm = lazy(() => import('../Tasks/TaskForm/TaskForm'));

const Template = ({ todoTemplate, isLoading, setIsLoading, message, setMessage }) => {
  const dispatch = useDispatch();
  const { tasks, currentPage, total } = useSelector(state => state.tasks).tempTasks[todoTemplate._id];
  const [openFormForNew, setOpenFormForNew] = useState(false);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [page, setPage] = useState(1);
  const { active, activites } = useSelector(state => state.timer);

  useEffect(() => {
    if (tasks === undefined && total === undefined) {
      dispatch(getTodoTasks(todoTemplate._id, 1, setLoadingTasks, setMessage));
    }
    // eslint-disable-next-line
  }, [tasks])

  useEffect(() => {
    console.log(page);
    if (page > currentPage) {
      dispatch(getTodoTasks(todoTemplate._id, Number(localStorage.getItem(`${todoTemplate._id}-currentPage`)) + 1, setLoadingTasks, setMessage));
    }

    // eslint-disable-next-line
  }, [page])

  useEffect(() => {
    const onScroll = () => {
      let scrollTop = document.querySelector('.tasks-container')?.scrollTop;
      let scrollHeight = document.querySelector('.tasks-list')?.scrollHeight;
      let clientHeight = document.querySelector('.tasks-container')?.clientHeight;

      if (scrollTop + clientHeight >= scrollHeight && Number(localStorage.getItem(`${todoTemplate._id}-total`)) > Number(localStorage.getItem(`${todoTemplate._id}-tasksLen`))) {
        setPage(Number(localStorage.getItem(`${todoTemplate._id}-currentPage`)) + 1);
      }
    }

    // console.log(tasks.tasks);

    document.querySelector('.tasks-container')?.addEventListener('scroll', onScroll);
    return () => document.querySelector('.tasks-container')?.removeEventListener('scroll', onScroll);

    // eslint-disable-next-line
  }, [tasks, total])

  if (tasks === undefined) {
    console.log(message);
    return (
      <>
        {(!message.message) ?
          (
            <>
              <Loading
                size="100"
                strokeWidth="2"
                backgroud="white"
                color={activites[active]?.color}
              />
            </>
          ) : (
            <>
              {(message.message && !message.message.includes('Network Error')) ? (
                <Message {...message} setMessage={setMessage} />
              ) : (
                <NetworkError />
              )}
            </>
          )
        }
      </>
    )
  }

  return (
    <>
      {tasks?.length > 0 && (
        <div className="tasks-list">
          {isLoading === 'new' ? (
            <>
              {tasks?.filter(t => !t.check)?.map((task, index) => (
                <Suspense fallback={
                  <div className="loading-container">
                    <Loading size="50" strokeWidth="3" color={"#fff"} backgroud="transparent" />
                  </div>
                } key={task._id}>
                  <Task
                    key={task._id}
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                    setMessage={setMessage}
                    {...task}
                  />
                </Suspense>
              ))}
              {
                <div className="loading-container">
                  <Loading size="50" strokeWidth="3" color={"#fff"} backgroud="transparent" />
                </div>
              }
              {tasks?.filter(t => t.check)?.map((task, index) => (
                <Suspense fallback={
                  <div className="loading-container">
                    <Loading size="50" strokeWidth="3" color={"#fff"} backgroud="transparent" />
                  </div>
                } key={task._id}>
                  <Task
                    key={task._id}
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                    setMessage={setMessage}
                    {...task}
                  />
                </Suspense>
              ))}
            </>
          ) : (
            <>
              {tasks?.map((task, index) => (
                <Suspense fallback={
                  <div className="loading-container">
                    <Loading size="50" strokeWidth="3" color={"#fff"} backgroud="transparent" />
                  </div>
                } key={task?._id}>
                  <Task
                    key={task._id}
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                    setMessage={setMessage}
                    {...task}
                  />
                </Suspense>
              ))}
            </>
          )}
        </div>
      )}
      <> {/* This is for loading while bringing the tasks */}
        {(loadingTasks && tasks.length > 0) && (
          <div className="loading-container">
            <Loading size="50" strokeWidth="3" color={"#fff"} backgroud="transparent" />
          </div>
        )}
      </>
      {!openFormForNew && (
        <button aria-label="add task button" className="add-task-button" onClick={() => setOpenFormForNew(p => !p)}>
          <AiOutlinePlus size="25px" />
          <p style={{ marginLeft: 10 }}>
            add task
          </p>
        </button>
      )}
      {openFormForNew && (
        <Suspense fallback={
          <div className="loading-container">
            <Loading size="60" strokeWidth="5" color={"#fff"} backgroud="transparent" />
          </div>
        }>
          <TaskForm setOpen={setOpenFormForNew} oldData={null} template={{ "_id": todoTemplate._id }} isLoading={isLoading} setIsLoading={setIsLoading} setMessage={setMessage} />
        </Suspense>
      )}
    </>
  );
};

export default Template;
