import React, { lazy, useEffect, useState } from 'react';

import Loading from '../../utils/Loading';
import Message from '../../utils/Message';
import { useDispatch, useSelector } from 'react-redux';

import { getSetting } from '../../actions/timer';
import NetworkError from '../NetworkError/NetworkError';

const ActiveTask = lazy(() => import('../../components/ActiveTask/ActiveTask'));
const Timer = lazy(() => import('../../components/Clock/Timer'));
const NavBar = lazy(() => import('../../components/NavBar/NavBar'));
const Tasks = lazy(() => import("../../components/Tasks/Tasks"));
const Setting = lazy(() => import("./../Setting/Setting"));
const Sidebar = lazy(() => import("./../Sidebar/Sidebar"));

function Home() {
  const { setting, started } = useSelector(state => state.timer);
  const [message, setMessage] = useState({ type: '', message: "" });
  const dispatch = useDispatch();
  const [isLoadingTask, setIsLoadingTask] = useState(null);
  const [openSetting, setOpenSetting] = useState(false);
  const [openTodo, setOpenTodo] = useState(false);
  const [openSticky, setOpenSticky] = useState(false);

  useEffect(() => {
    if (setting === undefined) {
      dispatch(getSetting(setMessage));
    }
    // eslint-disable-next-line
  }, [setting]);

  useEffect(() => {
    if (openSetting || openTodo || openSticky) {
      document.body.style.overflowY = 'hidden';
    } else {
      document.body.style.overflowY = 'auto';
    }
  }, [openSetting, openTodo, openSticky]);

  if (setting === undefined) {
    return (
      <>
        {(!message.message) ?
          (
            <>
              <Loading
                size="200"
                strokeWidth="2.5"
                color="#ffffff"
                backgroud="transperent"
              />
            </>
          ) : (
            <>
              {(message.message && !message.message.includes('Network Error')) ? (
                <Message {...message} setMessage={setMessage} />
              ) : (
                <NetworkError />
              )}
            </>
          )
        }
      </>
    )
  }

  return (
    <>
      {message.message && (
        <>
          {(!message.message.includes('Network Error')) ? (
            <Message {...message} setMessage={setMessage} />
          ) : (
            <NetworkError />
          )}
        </>
      )}
      <React.Suspense fallback={
        <Loading
          size="200"
          strokeWidth="5px"
          backgroud="transperent"
          color="#ffffff"
        />
      }>
        <div className='container'>
          <NavBar setMessage={setMessage} />
          {(setting?.focusMode && started) ? null : (
            <Sidebar setOpenSticky={setOpenSticky} setOpenTodo={setOpenTodo} />
          )}
          <div className="app">
            <Timer setIsLoadingTask={setIsLoadingTask} setMessage={setMessage} setOpenSetting={setOpenSetting} />
            <ActiveTask />
          </div>
          {openSetting && (
            <div className="glass-container">
              <Setting setOpenSetting={setOpenSetting} />
            </div>
          )}
          {openTodo && (
            <div className="glass-container">
              <Tasks message={message} setMessage={setMessage} isLoading={isLoadingTask} setIsLoading={setIsLoadingTask} setOpenTodo={setOpenTodo} />
            </div>
          )}
          {openSticky && (
            <div className="glass-container">
              <div className='glass-effect'><h1>sticky</h1></div>
            </div>
          )}
        </div>
      </React.Suspense>
    </>
  );
}

export default Home;
