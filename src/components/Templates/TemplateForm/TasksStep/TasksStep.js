import React, { lazy, useState, useEffect } from 'react';

import { AiOutlinePlus } from 'react-icons/ai';

import Loading from "../../../../utils/Loading";
import { useDispatch, useSelector } from 'react-redux';
import { getTasksForTemplate } from '../../../../actions/templates';

import '../../../Tasks/style.css'

const Task = lazy(() => import('../../../Tasks/Task/Task'));
const TaskForm = lazy(() => import('../../../Tasks/TaskForm/TaskForm'));

function TasksStep({ data, setData, handleChange, message, setMessage }) {
  const dispatch = useDispatch();
  const [openFormForNew, setOpenFormForNew] = useState(false);
  const [isLoading, setIsLoading] = useState("");
  const tasks = useSelector(state => state.templates.tempTasks[data?._id]) || {};
  const [page, setPage] = useState(1);
  const { active, activites } = useSelector(state => state.timer);

  useEffect(() => {
    if (tasks.tasks === undefined && data.tasks.length > 0) {
      dispatch(getTasksForTemplate(data?._id, 1, setMessage, setIsLoading));
    } else {
      setData({ ...data, tasks: tasks.tasks })
    }
    // eslint-disable-next-line
  }, [tasks.tasks]);

  useEffect(() => {
    if (page > tasks?.currentPage) {
      dispatch(getTasksForTemplate(data?._id, 1, setMessage, setIsLoading));
    }
    // eslint-disable-next-line
  }, [page])

  useEffect(() => {
    const onScroll = () => {
      let scrollTop = document.querySelector('.tasks-container')?.scrollTop;
      let scrollHeight = document.querySelector('.tasks-list')?.scrollHeight;
      let clientHeight = document.querySelector('.tasks-container')?.clientHeight;

      if (scrollTop + clientHeight >= scrollHeight && Number(localStorage.getItem(`${data._id}-total`)) > Number(localStorage.getItem(`${data._id}-tasksLen`))) {
        setPage(Number(localStorage.getItem(`${data._id}-currentPage`)) + 1);
      }
    }

    document.querySelector('.tasks-container')?.addEventListener('scroll', onScroll);
    return () => document.querySelector('.tasks-container')?.removeEventListener('scroll', onScroll);

    // eslint-disable-next-line
  }, [tasks.tasks, tasks.total])

  if (data.tasks.length > 0 && tasks.tasks === undefined) {
    console.log(message);
    return (
      <>
        <Loading
          size="100"
          strokeWidth="4"
          backgroud="white"
          color={activites[active]?.color}
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
                <Task
                  key={task._id}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  setMessage={setMessage}
                  {...task}
                />
              ))}
              {isLoading === 'new' && (
                <>
                  {
                    <div className="loading-container">
                      <Loading size="50" strokeWidth="3" color={"#fff"} backgroud="transparent" />
                    </div>
                  }
                </>
              )}
            </div>
          )}
          {/* This is for loading while bringing the tasks */}
          {(isLoading === 'tasks' && tasks.tasks?.length > 0) && (
            <div className="loading-container">
              <Loading size="50" strokeWidth="3" color={"#fff"} backgroud="transparent" />
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
            <TaskForm
              setOpen={setOpenFormForNew}
              oldData={null}
              template={data?._id ? { "_id": data?._id, todo: false } : null}
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
