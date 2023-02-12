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

function Home() {
  const { setting } = useSelector(state => state.timer);
  const [message, setMessage] = useState({ type: '', message: "" });
  const dispatch = useDispatch();
  const [isLoadingTask, setIsLoadingTask] = useState(null);

  useEffect(() => {
    if (setting === undefined) {
      dispatch(getSetting(setMessage));
    }
    // eslint-disable-next-line
  }, [setting]);

  if (setting === undefined) {
    return (
      <>
        {message.message && (
          <Message message={message.message} type={message.type} setMessage={setMessage} />
        )}
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
            <NetworkError />
          )
        }
      </>
    )
  }

  return (
    <>
      {(message.message && !message.message.includes('Network Error')) && (
        <Message {...message} setMessage={setMessage} />
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
          <div className="app">
            <Timer setIsLoadingTask={setIsLoadingTask} setMessage={setMessage} />
            <ActiveTask />
          </div>
          <Tasks setMessage={setMessage} isLoading={isLoadingTask} setIsLoading={setIsLoadingTask} />
        </div>
      </React.Suspense>
    </>
  );
}

export default Home;
