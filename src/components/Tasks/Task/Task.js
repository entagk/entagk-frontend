import React, { lazy, Suspense, useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import CircularMenu from "../../../icons/circularMenu/CircularMenu";

import { FiEdit3 } from 'react-icons/fi';
import { MdDelete, MdKeyboardArrowRight } from 'react-icons/md';
import { ImCheckboxChecked, ImCheckboxUnchecked } from 'react-icons/im';
import { RiCheckboxCircleFill, RiCheckboxBlankCircleLine } from 'react-icons/ri';
import { checkTask, deleteTask, CHANGE_ACTIVE_TASK } from "../../../actions/tasks";
import Loading from "../../../utils/Loading";

import "./style.css";

const TaskForm = lazy(() => import("../TaskForm/TaskForm"));

const Task = ({ isLoading, setIsLoading, setMessage, setActiveTemplate, activeTemplate, ...props }) => {
  const dispatch = useDispatch();
  const { activeId } = useSelector(state => state.tasks);
  const { setting } = useSelector(state => state.timer);
  const [openEdit, setOpenEdit] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    if (props.notes && document.querySelector(`.task#task-${props._id} .task-notes`)) {
      // eslint-disable-next-line
      let reg = /([\w+]+\:\/\/)?([\w\d-]+\.)*[\w-]+[\.\:]\w+([\/\?\=\&\#\.]?[\w-]+)*\/?/gm
      document.querySelector(`.task#task-${props._id} .task-notes`).innerHTML = "<p>" + props.notes.replaceAll(reg, (value) => `<a target="_blank" href="${value}">${value}</a>`) + "</p>";
    }
    // eslint-disable-next-line
  }, [props])

  const handleCheck = () => {
    dispatch(checkTask(props._id, setIsLoading, setMessage));
    setOpenMenu(false);
  }

  const handleDelete = () => {
    dispatch(deleteTask(props._id, props?.template || null, setIsLoading, setMessage));
    setOpenMenu(false);
  }

  const handleActive = () => {
    if (props.tasks.length === 0) {
      if ((!props.check && setting.autoStartNextTask) || (!setting.autoStartNextTask && props.act !== props.est)) {
        if (activeId === props._id) {
          dispatch({ type: CHANGE_ACTIVE_TASK, data: {} });
        } else if (activeId !== props._id) {
          dispatch({ type: CHANGE_ACTIVE_TASK, data: { ...props, _id: props.template?._id ? props.template?._id + "," + props._id : props._id } });
        }
      }
    }
  }

  if (openEdit) {
    return (
      <Suspense fallback={<Loading size="40" strokeWidth="3" color={"rgb(197 197 197)"} />}>
        <TaskForm oldData={props} setOpen={setOpenEdit} isLoading={isLoading} setIsLoading={setIsLoading} />
      </Suspense>
    )
  }

  return (
    <div
      className={`task ${activeId === props._id ? "active" : ''}`}
      id={`task-${props._id}`}
      style={{
        '--progress': `${props.act / props.est * 100}%`,
      }}
      onDoubleClick={handleActive}>
      {isLoading === props._id && (
        <div className="loading-container">
          <Loading size="40" strokeWidth="3" color={"rgb(197 197 197)"} />
        </div>
      )}
      <div style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        justifyContent: "space-between"
      }}>
        <div className="task-inner">
          <div className="icon-container">
            {props.check ? (
              <>
                {
                  (props.template !== null) ? (
                    <RiCheckboxCircleFill className="task-uncheck" />
                  ) : (
                    <ImCheckboxChecked className="task-uncheck" />
                  )
                }
              </>
            ) : (
              <>
                {props.template !== null ? (
                  <RiCheckboxBlankCircleLine className="task-check" />
                ) : (
                  <ImCheckboxUnchecked className="task-check" />
                )}
              </>
            )}
          </div>
          <p style={{
            textDecoration: props.check && "line-through"
          }}>{props.name}</p>
        </div>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: "row",
        }}>
          <p className="act-est">
            <span>{props.act}</span>
            <span style={{
              fontWeight: "normal",
              fontSize: "18px",
              marginInline: "4px"
            }}>/</span>
            <span>{props.est}</span>
          </p>
          <div className="menu">
            <button
              aria-label="toggle the task list menu"
              className="toggle-menu"
              onClick={() => setOpenMenu(om => !om)}>
              <CircularMenu />
            </button>
            {openMenu && (
              <div className="menu-content">
                <div className="row">
                  {props.tasks.length === 0 && (
                    <>
                      {(!setting.autoStartNextTask) && (
                        <button aria-label="check button" onClick={handleCheck}>
                          {!props.check ? (
                            <>
                              {
                                (props.template !== null) ? (
                                  <RiCheckboxCircleFill />
                                ) : (
                                  <ImCheckboxChecked />
                                )
                              }
                            </>
                          ) : (
                            <>
                              {props.template !== null ? (
                                <RiCheckboxBlankCircleLine />
                              ) : (
                                <ImCheckboxUnchecked />
                              )}
                            </>
                          )}
                        </button>
                      )}
                    </>
                  )}
                  <button
                    aria-label="edit button"
                    onClick={() => setOpenEdit(oe => !oe)}
                  >
                    <FiEdit3 />
                  </button>
                  <button
                    aria-label="delet button"
                    onClick={handleDelete}
                    style={{ color: 'red' }}
                    className="delete"
                  >
                    <MdDelete />
                  </button>
                </div>
              </div>
            )}
          </div>
          {props.tasks.length > 0 && (
            <button aria-label="toggle the tasks list"
              className="show-tasks"
              onClick={() => setActiveTemplate(props)}>
              <MdKeyboardArrowRight />
            </button>
          )}
        </div>
      </div>
      {props.notes !== '' && (
        <div className="task-notes">
        </div>
      )}
    </div>
  )
};

export default Task;
