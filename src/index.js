import React from 'react';
import ReactDOM from 'react-dom/client';

import { Provider } from 'react-redux';
import { createStore, compose } from "redux";

import './index.css';
import App from './App';

import reducers from './reducers';
import middleware from './middleware';

const root = ReactDOM.createRoot(document.getElementById('root'));
const myStore = createStore(reducers, compose(middleware));

root.render(
  <React.StrictMode>
    <Provider store={myStore}>
      <App />
    </Provider>
  </React.StrictMode>
);