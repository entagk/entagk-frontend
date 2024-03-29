import React, { lazy, useEffect, useState, Suspense } from 'react';

import { getTodoTasks } from '../../actions/tasks';

import Loading from '../../utils/Components/Loading/Loading';

import { useDispatch, useSelector } from 'react-redux';

import { onScroll } from '../../utils/helper';

const Task = lazy(() => import('./Task/Task'));
const TaskForm = lazy(() => import('./TaskForm/TaskForm'));
const AddTaskButton = lazy(() => import('./AddTaskButton/AddTaskButton'));

const Template = ({ todoTemplate, isLoading, setIsLoading, setMessage, setActiveTemplate }) => {
  const dispatch = useDispatch();
  /**
   * I have used '|| {}' because after cleaning the task template from act i get the following error, 
   *    Cannot destructure property 'tasks' of '(intermediate value)(intermediate value)(intermediate value)' as it is undefined.
   */
  const { tasks, currentPage, total } = useSelector(state => state?.tasks).tempTasks[todoTemplate._id] || {};
  const [openFormForNew, setOpenFormForNew] = useState(false);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [page, setPage] = useState(1);

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
    onScroll(setPage, `${todoTemplate._id}-total`, `${todoTemplate._id}-tasksLen`, `${todoTemplate._id}-currentPage`);
    // eslint-disable-next-line
  }, [tasks, total])

  if (tasks === undefined) {

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
      {tasks?.length > 0 && (
        <div className="tasks-list">
          {isLoading === 'new' ? (
            <>
              {tasks?.map((task, index) => (
                <Suspense fallback={
                  <Loading
                    size="medium"
                    color={"#fff"}
                    backgroud="transparent"
                    style={{}}
                  />
                }>
                  <Task
                    key={task._id}
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                    setMessage={setMessage}
                    setActiveTemplate={setActiveTemplate}
                    {...task}
                  />
                </Suspense>
              ))}
              {
                <Loading
                  size="medium"
                  color={"#fff"}
                  backgroud="transparent"
                />
              }
            </>
          ) : (
            <>
              {tasks?.map((task, index) => (
                <Suspense fallback={
                  <Loading
                    size="medium"
                    color={"#fff"}
                    backgroud="transparent"
                    style={{}}
                  />
                }>
                  <Task
                    key={task._id}
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                    setMessage={setMessage}
                    setActiveTemplate={setActiveTemplate}
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
            template={{ "_id": todoTemplate._id }}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            setMessage={setMessage}
          />
        )}
      </Suspense>
    </>
  );
};

export default Template;
