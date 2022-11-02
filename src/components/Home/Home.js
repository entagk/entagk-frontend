import React, { lazy, useEffect, useState } from 'react';

import Loading from '../../utils/Loading';
import Message from '../../utils/Message';
import { useDispatch, useSelector } from 'react-redux';

import { getSetting } from '../../actions/timer';

const ActiveTask = lazy(() => import('../../components/ActiveTask/ActiveTask'));
const Timer = lazy(() => import('../../components/Clock/Timer'));
const NavBar = lazy(() => import('../../components/NavBar/NavBar'));
const Tasks = lazy(() => import("../../components/Tasks/Tasks"));

function Home() {
  const { setting } = useSelector(state => state.timer);
  const [message, setMessage] = useState({ type: '', message: "" });
  const dispatch = useDispatch();

  useEffect(() => {
    if (setting === undefined) {
      dispatch(getSetting(setMessage));
    }
    // eslint-disable-next-line
  }, [setting]);

  if (setting === undefined) {
    return (
      <Loading
        size="200"
        strokeWidth="2.5"
        color="#ffffff"
        backgroud="transperent"
      />
    )
  }

  return (
    <>
      {message.message && (
        <Message message={message.message} type={message.type} setMessage={setMessage} />
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
          <NavBar />
          <div className="app">
            <Timer />
            <ActiveTask />
          </div>
          <Tasks />
        </div>
      </React.Suspense>
    </>
  );
}

export default Home;