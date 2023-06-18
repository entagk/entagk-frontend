import React, { lazy, Suspense, useState } from "react";

import { CgClose } from "react-icons/cg";
import { MdKeyboardArrowLeft } from 'react-icons/md';
import { useSelector } from "react-redux";
import Loading from "../../utils/Loading";

import "./style.css";

const Footer = lazy(() => import("./TaskFooter/TaskFooter"));
const Menu = lazy(() => import("./TasksMenu/TasksMenu"));
const Tasks = lazy(() => import("./Tasks"));

const Template = lazy(() => import("../Template/Template"));

const TodoList = ({ message, setMessage, isLoading, setIsLoading, setOpenTodo }) => {
  const [activeTemplate, setActiveTemplate] = useState(null);
  const tasks = useSelector(state => state.tasks);

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
          <div className="header">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'nowrap',
              flexDirection: 'row',
            }}>
              <div className="header-buttons">
                {!activeTemplate ? (
                  <Menu setMessage={setMessage} />
                ) : (
                  <div className="menu">
                    <button
                      aria-label="toggle the task list menu"
                      className="toggle-menu"
                      onClick={() => setActiveTemplate(null)}
                      style={{ fontSize: 25, color: "#fff" }}
                      disabled={tasks?.length === 0}>
                      <MdKeyboardArrowLeft />
                    </button>
                  </div>
                )}
              </div>
              <h2 style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: "10px",
              }}>
                {activeTemplate?._id ? activeTemplate?.name : "Tasks"}
              </h2>
            </div>
            <button aria-label='close tasks' className="close-tasks" type='button' onClick={() => setOpenTodo(false)}>
              <CgClose />
            </button>
          </div>
          <div className="tasks-container">
            {activeTemplate ? (
              <Template todoTemplate={activeTemplate} isLoading={isLoading} setIsLoading={setIsLoading} message={message} setMessage={setMessage} />
            ) : (
              <Tasks message={message} setMessage={setMessage} isLoading={isLoading} setIsLoading={setIsLoading} setOpenTodo={setOpenTodo} setActiveTemplate={setActiveTemplate} activeTemplate={activeTemplate} />
            )}
          </div>
          {tasks.tasks?.length > 0 && (
            <Footer activeTemplate={activeTemplate} />
          )}
        </div>
      </Suspense>
    </>
  )
};

export default TodoList;
