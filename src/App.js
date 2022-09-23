import React, { lazy } from 'react';
import './App.css';

const ActiveTask = lazy(() => import('./components/ActiveTask/ActiveTask'));
const Timer = React.lazy(() => import('./components/Clock/Timer'));
const Navigation = React.lazy(() => import('./components/Navigation/Navigation'));
const Tasks = React.lazy(() => import("./components/Tasks/Tasks"));


function App() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
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