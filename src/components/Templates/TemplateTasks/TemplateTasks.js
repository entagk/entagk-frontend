import React, { lazy, useState, useEffect, Suspense } from 'react';

import { AiOutlinePlus } from 'react-icons/ai';

import Loading from "../../../utils/Loading/Loading";
import { useDispatch, useSelector } from 'react-redux';
import { getTasksForTemplate } from '../../../actions/templates';

import './style.css';

const Task = lazy(() => import('../../Tasks/Task/Task'));
const TaskForm = lazy(() => import('../../Tasks/TaskForm/TaskForm'));

function TemplateTasks({ templateId, setMessage }) {
  const dispatch = useDispatch();
  const [openFormForNew, setOpenFormForNew] = useState(false);
  const [isLoading, setIsLoading] = useState("");
  const tasks = useSelector(state => state.templates.tempTasks[templateId]) || {};
  const { currentPage } = useSelector(state => state.templates.userTemplates);
  const template = useSelector(state =>
    state.templates.userTemplates.templates[currentPage - 1]
      .find(t => t._id === templateId)
  );
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (
      templateId &&
      tasks.tasks === undefined &&
      template.tasks?.length > 0 &&
      template.tasks.every(t => typeof t === 'string')
    ) {
      dispatch(getTasksForTemplate(templateId, 1, setMessage, setIsLoading));
    }
    // eslint-disable-next-line
  }, [tasks.tasks]);

  useEffect(() => {
    if (page > tasks?.currentPage) {
      dispatch(getTasksForTemplate(templateId, 1, setMessage, setIsLoading));
    }
    // eslint-disable-next-line
  }, [page])

  useEffect(() => {
    const onScroll = () => {
      let scrollTop = document.querySelector('.tasks-container')?.scrollTop;
      let scrollHeight = document.querySelector('.tasks-list')?.scrollHeight;
      let clientHeight = document.querySelector('.tasks-container')?.clientHeight;

      if (scrollTop + clientHeight >= scrollHeight && Number(localStorage.getItem(`${templateId}-total`)) > Number(localStorage.getItem(`${templateId}-tasksLen`))) {
        setPage(Number(localStorage.getItem(`${templateId}-currentPage`)) + 1);
      }
    }

    document.querySelector('.tasks-container')?.addEventListener('scroll', onScroll);
    return () => document.querySelector('.tasks-container')?.removeEventListener('scroll', onScroll);

    // eslint-disable-next-line
  }, [tasks.tasks, tasks.total])

  return (
    <>
      {(template.tasks?.length > 0
        && template.tasks.every(t => typeof t === 'string')
        && tasks.tasks === undefined) ? (
        <Loading
          size="big"
          backgroud="transparant"
          color="white"
        />
      ) : (
        <div className="tasks-container">
          {tasks.tasks?.length > 0 && (
            <div className="tasks-list">
              {tasks.tasks?.map((task) => (
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
                    template={templateId ? { "_id": templateId, todo: false } : 'new'}
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
            <Suspense fallback={
              <Loading
                size="big"
                color={"#fff"}
                backgroud="transparent"
                className="center-fullpage"
              />
            }>
              <TaskForm
                setOpen={setOpenFormForNew}
                oldData={null}
                template={templateId ? { "_id": templateId, todo: false } : 'new'}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                setMessage={setMessage}
              />
            </Suspense>
          )}
        </div>
      )}
    </>
  );
}

export default TemplateTasks;
