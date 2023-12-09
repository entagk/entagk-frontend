import React, { Suspense, lazy, useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { getTasks } from "../../actions/tasks";

import Loading from "../../utils/Components/Loading/Loading";

import "./style.css";
import { onScroll } from "../../utils/helper";

const TaskForm = lazy(() => import("./TaskForm/TaskForm"));
const Task = lazy(() => import("./Task/Task"));
const AddTaskButton = lazy(() => import('./AddTaskButton/AddTaskButton'))

const Tasks = ({ setMessage, isLoading, setIsLoading, setActiveTemplate, activeTemplate }) => {
  const [openFormForNew, setOpenFormForNew] = useState(false);
  const tasks = useSelector(state => state.tasks);
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
    onScroll(setPage, 'total', 'tasksLen', 'currentPage');
    // eslint-disable-next-line
  }, [tasks.tasks, tasks.total])

  if (tasks.tasks === undefined) {
    return (
      <>
        <Loading
          size="big"
          color="white"
          backgroud="transparent"
        />
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
                  <Loading
                    size="medium"
                    color={"#fff"}
                    backgroud="transparent"
                  />
                }>
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
                <Loading
                  size="medium"
                  color={"#fff"}
                  backgroud="transparent"
                  style={{ marginTop: 0 }}
                />
              }
              {tasks.tasks?.filter(t => t.check)?.map((task, index) => (
                <Task
                  key={task._id}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  setMessage={setMessage}
                  setActiveTemplate={setActiveTemplate}
                  activeTemplate={activeTemplate}
                  {...task}
                />
              ))}
            </>
          ) : (
            <>
              {tasks.tasks?.map((task, index) => (
                <Task
                  key={task._id}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  setMessage={setMessage}
                  setActiveTemplate={setActiveTemplate}
                  activeTemplate={activeTemplate}
                  {...task}
                />
              ))}
            </>
          )}
        </div>
      )}
      <> {/* This is for loading while bringing the tasks */}
        {(tasks.isLoading && tasks.tasks.length > 0) && (
          <Loading
            size="medium"
            color={"#fff"}
            backgroud="transparent"
            style={{ marginTop: 0 }}
          />
        )}
      </>
      {!openFormForNew && (
        <Suspense fallback={
          <Loading
            size="small"
            strokeWidth="5px"
            color={"#fff"}
            backgroud="transparent"
            style={{ margin: 0 }}
          />
        }>
          <AddTaskButton setOpenFormForNew={setOpenFormForNew} />
        </Suspense>
      )}
      <Suspense fallback={
        <Loading
          size="big"
          color={"#fff"}
          backgroud="transparent"
          className="center-fullpage"
        />
      }>
        {openFormForNew && (
          <TaskForm
            setOpen={setOpenFormForNew}
            oldData={null}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            setMessage={setMessage}
          />
        )}
      </Suspense>
    </>
  )
};

export default Tasks;
