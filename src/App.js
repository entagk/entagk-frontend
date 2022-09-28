import React, { lazy } from 'react';
import './App.css';
import Loading from '../src/utils/Loading';

const ActiveTask = lazy(() => import('./components/ActiveTask/ActiveTask'));
const Timer = React.lazy(() => import('./components/Clock/Timer'));
const Navigation = React.lazy(() => import('./components/Navigation/Navigation'));
const Tasks = React.lazy(() => import("./components/Tasks/Tasks"));


function App() {
  return (
    <React.Suspense fallback={<Loading backgroud="transparent" width="200" height="200" cx="50" cy="50" r="20" strokeWidth="2.5" color="#ffffff" containerHeight="500px" />}>
      <div className='container'>
        <Navigation />
        <div className="app">
          <Timer />
          <ActiveTask />
        </div>
        <Tasks />
      </div>
    </React.Suspense>
  );
}

export default App;