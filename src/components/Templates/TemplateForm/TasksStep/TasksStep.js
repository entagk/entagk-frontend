import React, { lazy, useState, useEffect, Suspense } from 'react';

import { AiOutlinePlus } from 'react-icons/ai';

import Loading from "../../../../utils/Loading/Loading";
import { useDispatch, useSelector } from 'react-redux';
import { getTasksForTemplate } from '../../../../actions/templates';

import '../../../Tasks/style.css'

import { onScroll } from '../../../../utils/helper';

const Task = lazy(() => import('../../../Tasks/Task/Task'));
const TaskForm = lazy(() => import('../../../Tasks/TaskForm/TaskForm'));

function TasksStep({ data, setData, message, setMessage }) {
  const dispatch = useDispatch();
  const [openFormForNew, setOpenFormForNew] = useState(false);
  const [isLoading, setIsLoading] = useState("");
  const tasks = useSelector(state => state.templates.tempTasks[data?._id]) || {};
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (data?._id && tasks.tasks === undefined && data.tasks?.length > 0 && data.tasks.every(t => typeof t === 'string')) {
      dispatch(getTasksForTemplate(data?._id, 1, setMessage, setIsLoading));
    } else {
      if (tasks.tasks) {
        setData({ ...data, tasks: tasks.tasks })
      }
    }
    console.log(data);
    // eslint-disable-next-line
  }, [tasks.tasks]);

  useEffect(() => {
    if (page > tasks?.currentPage) {
      dispatch(getTasksForTemplate(data?._id, 1, setMessage, setIsLoading));
    }
    // eslint-disable-next-line
  }, [page])

  useEffect(() => {
    onScroll(setPage, `${data._id}-total`, `${data._id}-tasksLen`, `${data._id}-currentPage`);
    // eslint-disable-next-line
  }, [tasks.tasks, tasks.total])

  if (data.tasks?.length > 0 && data.tasks.every(t => typeof t === 'string') && tasks.tasks === undefined) {
    console.log(message);
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
      <div className='step-data'>
        <div className="tasks-container">
          {data.tasks?.length > 0 && (
            <div className="tasks-list">
              {data.tasks?.map((task) => (
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
                    template={data?._id ? { "_id": data?._id, todo: false } : 'new'}
                    setTemplateData={data?._id ? null : setData}
                    {...task}
                  />
                </Suspense>
              ))}
              {isLoading === 'new' && (
                <>
                  {
                    <Loading
                      size="medium"
                      color={"#fff"}
                      backgroud="transparent"
                      style={{ marginTop: 0 }}
                    />
                  }
                </>
              )}
            </div>
          )}
          {/* This is for loading while bringing the tasks */}
          {(isLoading === 'tasks' && tasks.tasks?.length > 0) && (
            <Loading
              size="medium"
              color={"#fff"}
              backgroud="transparent"
              style={{ marginTop: 0 }}
            />
          )}
          {!openFormForNew ? (
            <button aria-label="add task button" className="add-task-button" onClick={() => setOpenFormForNew(p => !p)}>
              <AiOutlinePlus size="25px" />
              <p style={{ marginLeft: 10 }}>
                add task
              </p>
            </button>
          ) : (
            <TaskForm
              setOpen={setOpenFormForNew}
              oldData={null}
              template={data?._id ? { "_id": data?._id, todo: false } : 'new'}
              setTemplateData={data?._id ? null : setData}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              setMessage={setMessage}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default TasksStep;
