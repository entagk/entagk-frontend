import React, { lazy } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { FiEdit3 } from 'react-icons/fi';
import { GrAchievement } from 'react-icons/gr';
import { MdLogout, MdDelete } from "react-icons/md";

import { LOGOUT } from '../../actions/auth';

import { Link } from 'react-router-dom';

const TodoList = lazy(() => import('../../icons/list/TodoList'));
const Menu = lazy(() => import("../../utils/Menu/Menu"));
const MenuItem = lazy(() => import("../../utils/Menu/MenuItem"));

function UserMenu({ setOpenDelete, }) {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const logout = () => {
    dispatch({ type: LOGOUT });
  };

  const getUserName = () => {
    if (user.name.length <= 18) {
      return user.name;
    } else if (user.name.split(' ').length > 1) {
      return user.name.split(' ')[0] + " " + user.name.split(' ')[1][0] + ".";
    } else {
      return user.name.slice(0, 15) + '...';
    }
  }

  const toggleDelete = () => {
    setOpenDelete(true);
  };

  const stringToColor = (string) => {
    let hash = 0;
    let i;
    for (i = 0; i < string?.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";
    for (i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.substr(-2);
    }
    return color;
  };

  return (
    <Menu MainButton={
      <button
        aria-label="user button"
        className={`user-menu ${user?.avatar ? 'img' : ''}`}
        style={{ background: stringToColor(user?.name), padding: user?.avatar && 0 }}
      >
        {user?.avatar ? (
          <img
            src={user?.avatar}
            alt="avatar"
            width=""
            height=""
          />
        ) : (
          <span>
            {user.name[0].toUpperCase()}
          </span>
        )}
      </button>
    }>
      <div className="user-details">
        <div className="menu-avatar"
          style={{ background: stringToColor(user?.name), padding: user?.avatar && 0 }}
        >
          {user?.avatar ? (
            <img
              src={user?.avatar}
              alt="avatar"
              width=""
              height=""
            />
          ) : (
            <span>
              {user.name[0].toUpperCase()}
            </span>
          )}
        </div>
        <span className="user-name">{getUserName()}</span>
        <span className="user-email">{user.email}</span>
      </div>
      <MenuItem
        component={Link}
        to="/user/achievements"
        aria-label="user button in menu"
      >
        <GrAchievement />
        <span style={{ marginLeft: 10 }}>
          achievements
        </span>
      </MenuItem>
      <MenuItem
        component={Link}
        to="/templates/you"
        aria-label="user button in menu">
        <TodoList />
        <span style={{ marginLeft: 10 }}>
          todos templates
        </span>
      </MenuItem>
      <MenuItem
        component={Link}
        to="/user/edit"
        aria-label="user button in menu">
        <FiEdit3 />
        <span style={{ marginLeft: 10 }}>
          edit account
        </span>
      </MenuItem>
      <MenuItem
        onClick={logout}
        aria-label="logout button in menu">
        <MdLogout />
        <span style={{ marginLeft: 10 }}>
          Logout
        </span>
      </MenuItem>
      <MenuItem
        aria-label="delete account button"
        onClick={toggleDelete}
        style={{ color: "red" }}
      >
        <MdDelete />
        <span style={{ marginLeft: 10 }}>Delete Account</span>
      </MenuItem>
    </Menu>
  );
}

export default UserMenu;
