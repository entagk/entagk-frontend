import React, { lazy, Suspense, useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import CircularMenu from "../../../icons/circularMenu/CircularMenu";

import { FiEdit3 } from 'react-icons/fi';
import { MdDelete, MdKeyboardArrowRight } from 'react-icons/md';
import { ImCheckboxChecked, ImCheckboxUnchecked } from 'react-icons/im';
import { RiCheckboxCircleFill, RiCheckboxBlankCircleLine } from 'react-icons/ri';
import { checkTask, deleteTask, CHANGE_ACTIVE_TASK } from "../../../actions/tasks";
import Loading from "../../../utils/Loading/Loading";

import "./style.css";
import Menu from "../../../utils/Menu/Menu";
import MenuItem from "../../../utils/Menu/MenuItem";

const DeletePopup = lazy(() => import("./../../../utils/DeletePopup/DeletePopup"));
const TaskForm = lazy(() => import("../TaskForm/TaskForm"));

const Task = ({ isLoading, setIsLoading, setMessage, setActiveTemplate, setTemplateData, activeTemplate, ...props }) => {
  const dispatch = useDispatch();
  const { activeId } = useSelector(state => state.tasks);
  const { setting } = useSelector(state => state.timer);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

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
  }

  const handleDelete = () => {
    setOpenDelete(false);
    if (props?._id) {
      dispatch(deleteTask(props._id, props?.template || null, setIsLoading, setMessage));
    } else {
      setTemplateData(t => ({ ...t, tasks: t.tasks.filter(task => task.id !== props.id) }))
    };
  }


  const handleActive = () => {
    if (props.tasks?.length === 0) {
      if ((!props.check && setting.autoStartNextTask) || (!setting.autoStartNextTask && props.act !== props.est)) {
        if (activeId === props._id) {
          dispatch({ type: CHANGE_ACTIVE_TASK, data: {} });
        } else if (activeId !== props._id) {
          dispatch({ type: CHANGE_ACTIVE_TASK, data: { ...props, _id: props.template?._id ? props.template?._id + "," + props._id : props._id } });
        }
      }
    }
  }

  const toggleEdit = () => {
    setOpenEdit(true);
  }

  const toggleDelete = () => {
    setOpenDelete(true);
  }

  if (openEdit) {
    return (
      <Suspense fallback={<Loading size="40" strokeWidth="3" color={"rgb(197 197 197)"} />}>
        <TaskForm
          oldData={props}
          setOpen={setOpenEdit}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setMessage={setMessage}
          template={props?.template ? props.template : null}
          setTemplateData={setTemplateData}
        />
      </Suspense>
    )
  }

  return (
    <>
      {openDelete && (
        <DeletePopup
          type={<><span>{props.name}</span> {props.tasks?.length > 0 ? 'template' : 'task'}</>}
          onCancel={() => setOpenDelete(false)} onOk={handleDelete}
        />
      )}
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
              {(!props.template?.todo && props.template) ? (<></>) : (
                <>
                  <span>{props.act}</span>
                  <span style={{
                    fontWeight: "normal",
                    fontSize: "18px",
                    marginInline: "4px"
                  }}>/</span>
                </>
              )}
              <span>{props.est}</span>
            </p>
            <Suspense
              fallback={<></>}
            >
              <Menu MainButton={
                <button
                  aria-label="toggle the task list menu"
                  className="toggle-menu"
                  >
                  <CircularMenu />
                </button>
              }>
                {((props.template?.todo && props.template) || (!props.template && props.tasks.length === 0)) ? (
                  <>
                    {(!setting?.autoStartNextTask) ? (
                      <MenuItem aria-label="check button" onClick={handleCheck}>
                        {!props.check ? (
                          <>
                            {
                              (props.template !== null) ? (
                                <>
                                  <RiCheckboxCircleFill />
                                  <span style={{ marginLeft: 10 }}>
                                    Check
                                  </span>
                                </>
                              ) : (
                                <>
                                  <ImCheckboxChecked />
                                  <span style={{ marginLeft: 10 }}>
                                    Check
                                  </span>
                                </>
                              )
                            }
                          </>
                        ) : (
                          <>
                            {props.template !== null ? (
                              <>
                                <RiCheckboxBlankCircleLine />
                                <span style={{ marginLeft: 10 }}>
                                  Uncheck
                                </span>
                              </>
                            ) : (
                              <>
                                <ImCheckboxUnchecked />
                                <span style={{ marginLeft: 10 }}>
                                  Uncheck
                                </span>
                              </>
                            )}
                          </>
                        )}
                      </MenuItem>
                    ) : (<></>)}
                  </>
                ) : (<></>)}
                <MenuItem
                  aria-label="edit button"
                  onClick={toggleEdit}
                >
                  <FiEdit3 />
                  <span style={{ marginLeft: 10 }}>Edit</span>
                </MenuItem>
                <MenuItem
                  aria-label="delet button"
                  onClick={toggleDelete}
                  style={{ color: 'red' }}
                  className="delete"
                >
                  <MdDelete />
                  <span style={{ marginLeft: 10 }}>Delete</span>
                </MenuItem>
              </Menu>
            </Suspense>
            {props.tasks?.length > 0 && (
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
    </>
  )
};

export default Task;
