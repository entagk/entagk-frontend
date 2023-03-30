import React, { lazy } from 'react';
import { BsStickies } from 'react-icons/bs';

import './style.css';
const TodoList = lazy(() => import('../../icons/list/TodoList'));

const Sidebar = ({ setOpenSticky, setOpenTodo }) => {
  return (
    <div className='side-bar'>
      <button aria-label='todo list button' onClick={() => setOpenTodo(true)}>
        <TodoList />
      </button>
      <button aria-label='sticky notes button' onClick={() => setOpenSticky(true)}>
        <BsStickies />
      </button>
    </div>
  );
};

export default Sidebar;
