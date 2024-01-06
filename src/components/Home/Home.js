import React, { Suspense, lazy, useEffect, useState } from 'react';

import Loading from '../../utils/Components/Loading/Loading';
import Message from '../../utils/Components/Message/Message';
import { useDispatch, useSelector } from 'react-redux';

import { getSetting } from '../../actions/timer';
import { getOpenedNotes } from '../../actions/notes';
import NetworkError from '../NetworkError/NetworkError';
import Congratulation from '../../utils/Components/Congratulation/Congratulation';
import StickyNotes from '../StickyNotes/StickyNotes';

import "./style.css";

const ActiveTask = lazy(() => import('../../components/ActiveTask/ActiveTask'));
const Timer = lazy(() => import('../../components/Clock/Timer'));
const NavBar = lazy(() => import('../../components/NavBar/NavBar'));
const TodoList = lazy(() => import("../Tasks/TodoList"));
const Setting = lazy(() => import("./../Setting/Setting"));
const Sidebar = lazy(() => import("./../Sidebar/Sidebar"));
const Logo = lazy(() => import("../../icons/entagkLogo/logo"));

function Home() {
  const { setting, started } = useSelector(state => state.timer);
  const { congrats } = useSelector(state => state.tasks);
  const { totalOpenedNotes } = useSelector(state => state.notes);
  const [message, setMessage] = useState({ type: '', message: "" });
  const dispatch = useDispatch();
  const [isLoadingTask, setIsLoadingTask] = useState(null);
  const [openSetting, setOpenSetting] = useState(false);
  const [openTodo, setOpenTodo] = useState(false);
  const [openSticky, setOpenSticky] = useState(false);

  useEffect(() => {
    document.body.classList.add('home');

    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (setting === undefined) {
      dispatch(getSetting(setMessage));
      console.log("loading setting");
    }
    // eslint-disable-next-line
  }, [setting]);

  // get the openedList
  useEffect(() => {
    if (totalOpenedNotes === undefined) {
      dispatch(getOpenedNotes(setMessage));
      console.log('get total opened notes');
    }

    // eslint-disable-next-line
  }, [totalOpenedNotes])

  useEffect(() => {
    const handleKeys = (event) => {
      const inputsItems = ['input', 'textarea', 'textbox'];
      const activeElement = document.activeElement.tagName.toLowerCase();
      if (inputsItems.findIndex(item => item === activeElement || item === event.target.role) === -1) {
        if (event.code.toLowerCase() === 'keys' && !started) {
          setOpenSetting((e) => !e);
        }

        if (event.code.toLowerCase() === 'keyt') {
          setOpenTodo(e => !e);
        }

        if (event.code.toLowerCase() === 'keyn') {
          setOpenSticky(e => !e);
        }
      }
    };

    window.onkeydown = handleKeys;
  })

  if (
    (
      setting === undefined ||
      totalOpenedNotes === undefined
    )
  ) {
    return (
      <>
        {(!message.message) ?
          (
            <>
              <div className='center-fullpage' style={{ color: "#fff" }}>
                <div className='home-loading'>
                  <Suspense fallback={<></>}>
                    <Logo style={{ fontSize: "8em" }} />
                  </Suspense>
                  <p>loading...</p>
                </div>
              </div>
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
      {congrats && (
        <Congratulation text={congrats} />
      )}
      {message.message && (
        <>
          {(!message.message.includes('Network Error')) ? (
            <Message {...message} setMessage={setMessage} />
          ) : (
            <NetworkError />
          )}
        </>
      )}
      <React.Suspense
        fallback={
          <div className='center-fullpage' style={{ color: "#fff" }}>
            <div className='home-loading'>
              <p>loading...</p>
            </div>
          </div>
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
        </div>
        <StickyNotes setOpenSticky={setOpenSticky} openSticky={openSticky} setMessage={setMessage} />
      </React.Suspense>
      <React.Suspense
        fallback={
          <>
            <div className='glass-container'>
              <div className='glass-effect setting-loader'>
                <div className='header'>
                  <h2>loading setting...</h2>
                </div>
                <Loading
                  color="white"
                  backgroud="transparent"
                  size="big"
                />
              </div>
            </div>
          </>
        }
      >
        {openSetting && (
          <div className="glass-container">
            <Setting setOpenSetting={setOpenSetting} setMessage={setMessage} />
          </div>
        )}
      </React.Suspense>
      <React.Suspense
        fallback={
          <>
            <div className='glass-container'>
              <div className='glass-effect todo-loader'>
                <div className='anaheader'>
                  <h2>loading tasks...</h2>
                </div>
                <Loading
                  color="white"
                  backgroud="transparent"
                  size="big"
                />
              </div>
            </div>
          </>
        }
      >
        {openTodo && (
          <div className="glass-container">
            <TodoList
              message={message}
              setMessage={setMessage}
              isLoading={isLoadingTask}
              setIsLoading={setIsLoadingTask}
              setOpenTodo={setOpenTodo}
            />
          </div>
        )}
      </React.Suspense>
    </>
  );
}

export default Home;
