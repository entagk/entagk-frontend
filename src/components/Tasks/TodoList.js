import React, { lazy, Suspense, useState } from "react";

import { CgClose } from "react-icons/cg";
import { MdKeyboardArrowLeft } from 'react-icons/md';
import { useSelector } from "react-redux";
import Loading from "../../utils/Components/Loading/Loading";

import "./style.css";
import Button from "../../utils/Components/Button/Button";

const Footer = lazy(() => import("./TaskFooter/TaskFooter"));
const Menu = lazy(() => import("./TasksMenu/TasksMenu"));
const Tasks = lazy(() => import("./Tasks"));
const Template = lazy(() => import("./TodoTemplate"));
const Header = lazy(() => import('./../../utils/Components/GlassEffectHeader/header'));

const TodoList = ({ setMessage, isLoading, setIsLoading, setOpenTodo }) => {
  const [activeTemplate, setActiveTemplate] = useState(null);
  const tasks = useSelector(state => state.tasks);

  return (
    <>
      <div className="tasks glass-effect">
        <Suspense fallback={
          <div className='glass-container'>
            <div className='glass-effect todo-loader'>
              <div className='header'>
                <h2>loading tasks...</h2>
              </div>
              <Loading
                color="white"
                backgroud="transparent"
                size="big"
              />
            </div>
          </div>
        }>
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
            {activeTemplate ? (
              <Template
                todoTemplate={activeTemplate}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                setMessage={setMessage}
                setActiveTemplate={setActiveTemplate}
              />
            ) : (
              <Tasks
                setMessage={setMessage}
                todoTemplate={activeTemplate}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                setOpenTodo={setOpenTodo}
                setActiveTemplate={setActiveTemplate}
                activeTemplate={activeTemplate}
              />
            )}
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
        </Suspense>
      </div>
    </>
  )
};

export default TodoList;
