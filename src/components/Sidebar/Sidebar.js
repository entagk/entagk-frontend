import React, { lazy } from 'react';
import { BsStickies } from 'react-icons/bs';

import './style.css';
import Button from '../../utils/Button/Button';
const TodoList = lazy(() => import('../../icons/list/TodoList'));

const Sidebar = ({ setOpenSticky, setOpenTodo }) => {
  return (
    <div className='side-bar'>
      <Button
        aria-label='todo list button'
        onClick={() => setOpenTodo(true)}
        startIcon={
          <TodoList />
        }
        style={{
          padding: '10px 10px 10px 24px',
          borderRadius: '30px 0 0 30px',
        }}
      />
      <Button
        aria-label='sticky notes button'
        onClick={() => setOpenSticky(true)}
        startIcon={
          <BsStickies />
        }
        style={{
          padding: '10px 10px 10px 24px',
          borderRadius: '30px 0 0 30px',
        }}
      />
    </div>
  );
};

export default Sidebar;
