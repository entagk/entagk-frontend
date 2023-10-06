import React, { lazy, Suspense, useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import CircularMenu from "../../../icons/circularMenu/CircularMenu";

import { FiEdit3 } from 'react-icons/fi';
import { MdDelete, MdKeyboardArrowRight } from 'react-icons/md';
import { ImCheckboxChecked, ImCheckboxUnchecked } from 'react-icons/im';
import { RiCheckboxCircleFill, RiCheckboxBlankCircleLine } from 'react-icons/ri';
import { checkTask, deleteTask, CHANGE_ACTIVE_TASK } from "../../../actions/tasks";
import { CHANGE_TO_TEMPLATE_SETTING } from '../../../actions/timer';

import Loading from "../../../utils/Loading/Loading";
import Button from "../../../utils/Button/Button";

import "./style.css";

const Menu = lazy(() => import("../../../utils/Menu/Menu"));

const DeletePopupSmaller = lazy(() => import("./../../../utils/DeletePopup/DeletePopupSmaller"));
const TaskForm = lazy(() => import("../TaskForm/TaskForm"));

const Task = ({
  isLoading,
  setIsLoading,
  setMessage,
  setActiveTemplate,
  setTemplateData,
  activeTemplate,
  ...props
}) => {
  const dispatch = useDispatch();
  const { activeId } = useSelector(state => state.tasks);
  const { setting } = useSelector(state => state.timer);
  const template = useSelector(state => state.tasks?.tasks?.filter(t => t._id === props?.template?._id)[0]);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    if (
      props.notes &&
      document.querySelector(`.task#task-${props._id} .task-notes`)) {
      // eslint-disable-next-line
      let reg = /([\w+]+\:\/\/)?([\w\d-]+\.)*[\w-]+[\.\:]\w+([\/\?\=\&\#\.]?[\w-]+)*\/?/gm
      document.querySelector(`.task#task-${props._id} .task-notes`).innerHTML = "<p>" + props.notes.replaceAll(reg, (value) => `<a target="_blank" href="${value}">${value}</a>`) + "</p>";
    }
    // eslint-disable-next-line
  }, [props])

  const handleCheck = () => {
    dispatch(checkTask(props, setIsLoading, setMessage));
    setOpenMenu(false);
  }

  const handleDelete = () => {
    setOpenDelete(false);
    if (props?._id) {
      dispatch(deleteTask(props._id, props?.template || null, setIsLoading, setMessage, setActiveTemplate, template?.tasks || []));
    } else {
      setTemplateData(t => ({ ...t, tasks: t.tasks.filter(task => task.id !== props.id) }))
    };
  }

  const handleActive = () => {
    console.log('activate', props);
    if (props.tasks?.length === 0 || !props?.tasks) {
      if ((!props.check && setting.autoStartNextTask) || (!setting.autoStartNextTask && props.act !== props.est)) {
        if (activeId === props._id) {
          dispatch({ type: CHANGE_ACTIVE_TASK, data: {} });
        } else if (activeId !== props._id) {
          dispatch({ type: CHANGE_ACTIVE_TASK, data: { ...props, _id: props.template?._id ? props.template?._id + "," + props._id : props._id } });
          if (setting.applyTaskSetting) {
            dispatch({ type: CHANGE_TO_TEMPLATE_SETTING, data: template?.setting })
          }
        }
      }
    }
  }

  const toggleEdit = () => {
    setOpenEdit(true);
    setOpenMenu(false);
  }

  const toggleDelete = () => {
    setOpenDelete(e => !e);
    setOpenMenu(false);
  }

  if (openEdit) {
    return (
      <Suspense fallback={
        <Loading
          size="medium"
          color={"#fff"}
          backgroud="transparent"
          className="center-fullpage"
        />
      }>
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
        <Suspense fallback={
          <div style={{ position: "relative" }}>
            <Loading
              size="medium"
              color="var(--main-color)"
              backgroud="transparent"
              style={{
                position: "absolute",
                background: "#fff",
                color: "#000",
                right: 0,
                zIndex: 1010,
                top: "45px",
                fontSize: "20px",
                padding: 10,
                borderRadius: 8,
              }}
            />
          </div>
        }>
          <div style={{ position: "relative" }}>
            <DeletePopupSmaller
              type={<><span>{props.name}</span> {props.tasks?.length > 0 ? 'template' : 'task'}</>}
              onCancel={() => setOpenDelete(false)}
              onOk={handleDelete}
            />
          </div>
        </Suspense>
      )}
      <div
        className={`task ${activeId === props._id ? "active" : ''}`}
        id={`task-${props._id}`}
        style={{
          '--progress': `${props.act / props.est * 100}%`,
        }}
        onDoubleClick={handleActive}>
        {isLoading === props._id && (
          <Loading
            size="medium"
            color={"#fff"}
            backgroud="transparent"
            className="center-fullpage"
            style={{
              position: 'absolute',
              margin: 0,
              background: '#68696996',
              borderRadius: 'inherit',
              zIndex: 1010
            }}
          />
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
              fallback={
                <Loading
                  size="small"
                  color={"#fff"}
                  backgroud="transparent"
                  className="center-fullpage"
                />
              }
            >
              <Menu
                open={openMenu}
                setOpen={setOpenMenu}
                MainButton={
                  <Button
                    aria-label="toggle the task list menu"
                    className="toggle-menu"
                    startIcon={
                      <CircularMenu />
                    }
                    variant="single-icon"
                  />
                }>
                {(
                  (props?.template?.todo && props?.template) ||
                  (!props?.template && props?.tasks?.length === 0) ||
                  (!props?.tasks)
                ) ? (
                  <>
                    {(!setting?.autoStartNextTask) ? (
                      <Button
                        aria-label="check button"
                        onClick={handleCheck}
                        variant="none"
                        startIcon={
                          <>
                            {!props.check ? (
                              <>
                                {
                                  (props?.template !== null) ? (
                                    <>
                                      <RiCheckboxCircleFill />
                                    </>
                                  ) : (
                                    <>
                                      <ImCheckboxChecked />
                                    </>
                                  )
                                }
                              </>
                            ) : (
                              <>
                                {props.template !== null ? (
                                  <>
                                    <RiCheckboxBlankCircleLine />
                                  </>
                                ) : (
                                  <>
                                    <ImCheckboxUnchecked />
                                  </>
                                )}
                              </>
                            )}
                          </>
                        }
                      >
                        {!props.check ? (
                          <>
                            Check
                          </>
                        ) : (
                          <>
                            Uncheck
                          </>
                        )}
                      </Button>
                    ) : (<></>)}
                  </>
                ) : (<></>)}
                <Button
                  variant="none"
                  aria-label="edit button"
                  onClick={toggleEdit}
                  startIcon={
                    <FiEdit3 />
                  }
                >
                  <>Edit</>
                </Button>
                <Button
                  variant="none"
                  aria-label="delet button"
                  onClick={toggleDelete}
                  style={{ color: 'red' }}
                  className="delete"
                  startIcon={
                    <MdDelete />
                  }
                >
                  <>Delete</>
                </Button>
              </Menu>
            </Suspense>
            {props.tasks?.length > 0 && (
              <Button
                aria-label="toggle the tasks list"
                className="show-tasks"
                startIcon={
                  <MdKeyboardArrowRight />
                }
                variant="single-icon"
                onClick={() => setActiveTemplate(props)}
                style={{
                  margin: 0
                }}
              />
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
