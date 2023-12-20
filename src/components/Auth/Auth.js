import React, { Suspense, lazy, useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";

import { getSetting, initialSetting } from '../../actions/timer';
import { getNotes, getOpenedNotes } from '../../actions/notes';
import { getTasks } from '../../actions/tasks';

import Message from '../../utils/Components/Message/Message';
import LogoutPage from "./LogoutPage/LogoutPage";
import NetworkError from "../NetworkError/NetworkError";
// import Loading from '../../utils/Components/Loading/Loading';

const NavBar = lazy(() => import("../NavBar/NavBar"));
const SaveLocalPopup = lazy(() => import('./SaveLocal/SaveLocal'));
const AuthForm = lazy(() => import('./AuthForm/AuthForm'));
const Logo = lazy(() => import('../../icons/entagkLogo/logo'));

const Auth = () => {
  const dispatch = useDispatch();
  const { setting } = useSelector(state => state.timer);
  const { tasks } = useSelector(state => state.tasks) || { tasks: [] };
  const { notes } = useSelector(state => state.notes) || { notes: { ids: [], objects: {} } };
  const [message, setMessage] = useState({ type: '', message: '' });
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    document.body.classList.remove('home');

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (setting === undefined) {
      dispatch(getSetting(setMessage));
    }

    if (tasks === undefined) {
      dispatch(getTasks(setMessage));
    }

    if (notes.ids === undefined) {
      dispatch(getOpenedNotes(setMessage));
      dispatch(getNotes(setMessage));
    }

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    console.log("suc:", success);
  }, [success]);

  if (message.message === 'Network Error') {
    return (
      <NetworkError />
    )
  }

  if (localStorage.getItem('token') && !success) {
    return (
      <LogoutPage />
    )
  }

  if (setting === undefined || tasks === undefined || notes.ids === undefined) {
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
    <Suspense fallback={
      <div className='center-fullpage'>
        <div className='home-loading'>
          <p>loading...</p>
        </div>
      </div>
    }>
      <div>
        {success && (
          JSON.stringify(setting) !== JSON.stringify(initialSetting) ||
          tasks.length > 0 ||
          notes.ids.length > 0
        ) && (
            <SaveLocalPopup
              timerSettings={setting}
              tasks={tasks}
              notes={notes}
              setMessage={setMessage}
            />
          )}
        <div className="container">
          <NavBar setMessage={setMessage} />
          {message.message && (
            <>
              {(!message.message.includes('Network Error')) ? (
                <Message {...message} setMessage={setMessage} />
              ) : (
                <NetworkError />
              )}
            </>
          )}
          <AuthForm
            setMessage={setMessage}
            setSuccess={setSuccess}
            localData={JSON.stringify(setting) !== JSON.stringify(initialSetting) || tasks.length > 0 || notes.ids.length > 0}
          />
        </div>
      </div>
    </Suspense>
  )
}

export default Auth;
