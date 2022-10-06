import React from 'react';
import ReactDOM from 'react-dom/client';

import { Provider } from 'react-redux';
import { createStore, compose } from "redux";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from 'react-router-dom';

import './index.css';
import App from './App';
import ErrorPage from './components/ErrorPage/ErrorPage';

import reducers from './reducers';
import middleware from './middleware';
import Auth from './components/Auth/Auth';
import Profile from './components/Profile/Profile';
import Subsecription from './components/Subsecription/Subsecription';
import Setting from './components/Setting/Setting';
import Report from './components/Report/Report';

const root = ReactDOM.createRoot(document.getElementById('root'));
const myStore = createStore(reducers, compose(middleware));

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='' errorElement={<ErrorPage />}>
      <Route
        path='/'
        element={<App />}
        errorElement={<ErrorPage />}
      />
      <Route 
        path='/auth' 
        element={<Auth />} 
      />
      <Route 
        path="/profile" 
        element={<Profile />} 
      />
      <Route 
        path="/subsecription" 
        element={<Subsecription />}
      />
      <Route 
        path="/setting" 
        element={<Setting />} 
      />
      <Route 
        path="/report" 
        element={<Report />}
      />
    </Route>
  )
)

root.render(
  <React.StrictMode>
    <Provider store={myStore}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);