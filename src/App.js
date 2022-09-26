import React, { lazy } from 'react';
import './App.css';
import Loading from './Utils/Loading';

const ActiveTask = lazy(() => import('./components/ActiveTask/ActiveTask'));
const Timer = React.lazy(() => import('./components/Clock/Timer'));
const Navigation = React.lazy(() => import('./components/Navigation/Navigation'));
const Tasks = React.lazy(() => import("./components/Tasks/Tasks"));


function App() {
  return (
    <React.Suspense fallback={<Loading color="#ffffff" />}>
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