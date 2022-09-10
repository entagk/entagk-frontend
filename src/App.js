import React from 'react';
import './App.css';

const Timer = React.lazy(() => import('./components/Clock/Timer'));
const Navigation = React.lazy(() => import('./components/Navigation/Navigation'));


function App() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <div className='container'>
        <Navigation />
        <div className="app">
          <Timer />
        </div>
      </div>
    </React.Suspense>
  );
}

export default App;