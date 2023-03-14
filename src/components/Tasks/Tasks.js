import React, { lazy, Suspense, useEffect, useState } from "react";

import { AiOutlinePlus } from 'react-icons/ai';
import { CgClose } from "react-icons/cg";
import { useDispatch, useSelector } from "react-redux";
import { getTasks } from "../../actions/tasks";
import Loading from "../../utils/Loading";
import Message from "../../utils/Message";
import NetworkError from "../NetworkError/NetworkError";

import "./style.css";

const TaskForm = lazy(() => import("./TaskForm/TaskForm"));
const Footer = lazy(() => import("./TaskFooter/TaskFooter"));
const Menu = lazy(() => import("./TasksMenu/TasksMenu"));
const Task = lazy(() => import("./Task/Task"));

const Tasks = ({ message, setMessage, isLoading, setIsLoading, setOpenTodo }) => {
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
      let scrollTop = document.documentElement.scrollTop;
      let scrollHeight = document.querySelector('.tasks-list')?.scrollHeight;
      let clientHeight = document.documentElement.clientHeight;

      if (scrollTop + clientHeight >= scrollHeight && Number(localStorage.getItem('total')) > Number(localStorage.getItem('tasksLen'))) {
        setPage(Number(localStorage.getItem('currentPage')) + 1);
      }
    }

    // console.log(tasks.tasks);

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);

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
                size="200"
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
      <Suspense fallback={
        <Loading
          size="200"
          strokeWidth="5"
          color="white"
          backgroud="transparent"
        />
      }>
        <div className="tasks glass-effect zoom-in">
          <div className="close-button-container">
          </div>
          <div className="header">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'nowrap',
              flexDirection: 'row',
            }}>
              <div className="header-buttons">
                <Menu setMessage={setMessage} />
              </div>
              <h2 style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: "10px",
              }}>
                Tasks
              </h2>
            </div>
            <button aria-label='close tasks' className="close-tasks" type='button' onClick={() => setOpenTodo(false)}>
              <CgClose />
            </button>
          </div>
          <div className="tasks-container">
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
            <> {/* This is for loading while bringing the tasks */}
              {(tasks.isLoading && tasks.tasks.length > 0) && (
                <div className="loading-container">
                  <Loading size="50" strokeWidth="3" color={"#fff"} backgroud="transparent" />
                </div>
              )}
            </>
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
