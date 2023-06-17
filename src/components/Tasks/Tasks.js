import React, { lazy, Suspense, useEffect, useState } from "react";

import { AiOutlinePlus } from 'react-icons/ai';
import { useDispatch, useSelector } from "react-redux";
import { getTasks } from "../../actions/tasks";
import Loading from "../../utils/Loading";
import Message from "../../utils/Message";
import NetworkError from "../NetworkError/NetworkError";

import "./style.css";

const TaskForm = lazy(() => import("./TaskForm/TaskForm"));
const Task = lazy(() => import("./Task/Task"));

const Tasks = ({ message, setMessage, isLoading, setIsLoading, setActiveTemplate, activeTemplate }) => {
  const [openFormForNew, setOpenFormForNew] = useState(false);
  const tasks = useSelector(state => state.tasks);
  const { active, activites } = useSelector(state => state.timer);
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();

  useEffect(() => {
    if (tasks.tasks === undefined && tasks?.total === undefined) {
      dispatch(getTasks(setMessage, 1));
    }
    // eslint-disable-next-line
  }, [tasks.tasks]);

  useEffect(() => {
    console.log(page);
    if (page > tasks.currentPage) {
      dispatch(getTasks(setMessage, Number(localStorage.getItem('currentPage')) + 1));
    }

    // eslint-disable-next-line
  }, [page])

  useEffect(() => {
    const onScroll = () => {
      let scrollTop = document.querySelector('.tasks-container')?.scrollTop;
      let scrollHeight = document.querySelector('.tasks-list')?.scrollHeight;
      let clientHeight = document.querySelector('.tasks-container')?.clientHeight;

      if (scrollTop + clientHeight >= scrollHeight && Number(localStorage.getItem('total')) > Number(localStorage.getItem('tasksLen'))) {
        setPage(Number(localStorage.getItem('currentPage')) + 1);
      }
    }

    // console.log(tasks.tasks);

    document.querySelector('.tasks-container')?.addEventListener('scroll', onScroll);
    return () => document.querySelector('.tasks-container')?.removeEventListener('scroll', onScroll);

    // eslint-disable-next-line
  }, [tasks.tasks, tasks.total])

  if (tasks.tasks === undefined) {
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
                  <Task
                    key={task._id}
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                    setMessage={setMessage}
                    setActiveTemplate={setActiveTemplate}
                    activeTemplate={activeTemplate}
                    {...task}
                  />
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
                  <Task
                    key={task._id}
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                    setMessage={setMessage}
                    setActiveTemplate={setActiveTemplate}
                    activeTemplate={activeTemplate}
                    {...task}
                  />
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
                  <Task
                    key={task._id}
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                    setMessage={setMessage}
                    setActiveTemplate={setActiveTemplate}
                    activeTemplate={activeTemplate}
                    {...task}
                  />
                </Suspense>
              ))}
            </>
          )}
        </div>
      )}
      <> {/* This is for loading while bringing the tasks */}
        {(tasks.isLoading && tasks.tasks.length > 0) && (
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
          <TaskForm setOpen={setOpenFormForNew} oldData={null} isLoading={isLoading} setIsLoading={setIsLoading} setMessage={setMessage} />
        </Suspense>
      )}
    </>
  )
};

export default Tasks;
