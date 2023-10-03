import React, { lazy, Suspense, useState } from "react";

import { CgClose } from "react-icons/cg";
import { MdKeyboardArrowLeft } from 'react-icons/md';
import { useSelector } from "react-redux";
import Loading from "../../utils/Loading/Loading";

import "./style.css";
import Button from "../../utils/Button/Button";

const Footer = lazy(() => import("./TaskFooter/TaskFooter"));
const Menu = lazy(() => import("./TasksMenu/TasksMenu"));
const Tasks = lazy(() => import("./Tasks"));
const Template = lazy(() => import("./TodoTemplate"));
const Header = lazy(() => import('./../../utils/GlassEffectHeader/header'));

const TodoList = ({ message, setMessage, isLoading, setIsLoading, setOpenTodo }) => {
  const [activeTemplate, setActiveTemplate] = useState(null);
  const tasks = useSelector(state => state.tasks);

  return (
    <>
      <div className="tasks glass-effect zoom-in">
        <Header
          title={activeTemplate?._id ? activeTemplate?.name : "Tasks"}
          showLeft={true}
          LeftButton={
            !activeTemplate ? (
              <Suspense fallback={
                <Loading
                  size="small"
                  color="white"
                  backgroud="transparant"
                />
              }>
                <Menu setMessage={setMessage} />
              </Suspense>
            ) : (
              <div className="menu">
                <Button
                  aria-label="toggle the task list menu"
                  className="toggle-menu"
                  onClick={() => setActiveTemplate(null)}
                  disabled={tasks?.length === 0}
                  startIcon={
                    <MdKeyboardArrowLeft />
                  }
                  variant="single-icon"
                />
              </div>
            )
          }
          RightButton={
            <Button
              aria-label='close tasks'
              className="close"
              type='button'
              onClick={() => setOpenTodo(false)}
              variant='none'
              startIcon={
                <CgClose />
              }
            />
          }
        />
        <div className="tasks-container" style={{ marginBlock: 0 }}>
          <Suspense fallback={
            <Loading
              size="big"
              color="white"
              backgroud="transparant"
            />
          }>
            {activeTemplate ? (
              <Template
                todoTemplate={activeTemplate}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                message={message}
                setMessage={setMessage}
                setActiveTemplate={setActiveTemplate}
              />
            ) : (
              <Tasks
                message={message}
                setMessage={setMessage}
                todoTemplate={activeTemplate}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                setOpenTodo={setOpenTodo}
                setActiveTemplate={setActiveTemplate}
                activeTemplate={activeTemplate}
              />
            )}
          </Suspense>
        </div>
        <Suspense fallback={
          <Loading
            size="small"
            color="white"
            backgroud="transparant"
          />
        }>
          {tasks.tasks?.length > 0 && (
            <Footer
              activeTemplate={activeTemplate}
            />
          )}
        </Suspense>
      </div>
    </>
  )
};

export default TodoList;
