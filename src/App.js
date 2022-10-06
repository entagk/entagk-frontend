import React, { lazy, useEffect, useState } from 'react';
import './App.css';
import Loading from './utils/Loading';
import Message from './utils/Message';
import { useDispatch, useSelector } from 'react-redux';

import { getSetting } from './actions/timer';
import { getTasks } from './actions/tasks';

const ActiveTask = lazy(() => import('./components/ActiveTask/ActiveTask'));
const Timer = React.lazy(() => import('./components/Clock/Timer'));
const NavBar = React.lazy(() => import('./components/NavBar/NavBar'));
const Tasks = React.lazy(() => import("./components/Tasks/Tasks"));

function App() {
  const { setting } = useSelector(state => state.timer);
  const { tasks } = useSelector(state => state.tasks);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  
  useEffect(() => {
    if (!tasks) {
      dispatch(getTasks(setError));
    }
    // eslint-disable-next-line
  }, [tasks])

  useEffect(() => {
    if (setting.format === undefined) {
      dispatch(getSetting(setError));
    }
    // eslint-disable-next-line
  }, [setting.format]);

  if (setting.format === undefined || !tasks) {
    return (
      <Loading
        backgroud="transparent"
        width="200"
        height="200"
        cx="50"
        cy="50"
        r="20"
        strokeWidth="2.5"
        color="#ffffff"
        containerHeight="500px"
      />
    )
  }

  return (
    <>
      {error && (
        <Message message={error} type="error" setMessage={setError} />
      )}
      <React.Suspense fallback={
        <Loading
          backgroud="transparent"
          width="200"
          height="200"
          cx="50"
          cy="50"
          r="20"
          strokeWidth="2.5"
          color="#ffffff"
          containerHeight="500px"
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

export default App;