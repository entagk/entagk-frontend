import React, { lazy, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { FiEdit3 } from 'react-icons/fi';
import { GrAchievement } from 'react-icons/gr';
import { MdLogout, MdDelete } from "react-icons/md";

import { LOGOUT } from '../../actions/auth';

import { Link } from 'react-router-dom';
import Button from '../../utils/Button/Button';

const TodoList = lazy(() => import('../../icons/list/TodoList'));
const Menu = lazy(() => import("../../utils/Menu/Menu"));

function UserMenu({ setOpenDelete, }) {
  const dispatch = useDispatch();
  const [openMenu, setOpenMenu] = useState(false);
  const { user } = useSelector(state => state.auth);

  const logout = () => {
    dispatch({ type: LOGOUT });
    setOpenMenu(false);
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
    setOpenMenu(false);
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
    <Menu
      open={openMenu}
      setOpen={setOpenMenu}
      MainButton={
        <Button
          aria-label="user button"
          className={`user-menu ${user?.avatar ? 'img' : ''}`}
          style={{ background: stringToColor(user?.name), padding: user?.avatar && 0 }}
          variant='none'
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
        </Button>
      }
    >
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
      <Button
        component={Link}
        to="/user/achievements"
        aria-label="achievments link in user menu"
        variant='none'
        startIcon={
          <GrAchievement />
        }
      >
        achievements
      </Button>
      <Button
        component={Link}
        to="/templates/you"
        aria-label="templates link in user menu"
        variant='none'
        startIcon={
          <TodoList />
        }
      >
        todos templates
      </Button>
      <Button
        component={Link}
        to="/user/edit"
        aria-label="edit user link in user menu"
        variant='none'
        startIcon={
          <FiEdit3 />
        }
      >
        edit account
      </Button>
      <Button
        onClick={logout}
        aria-label="logout button in menu"
        variant='none'
        startIcon={
          <MdLogout />
        }
      >
        Logout
      </Button>
      <Button
        aria-label="delete account button"
        onClick={toggleDelete}
        style={{ color: "red" }}
        variant='none'
        startIcon={
          <MdDelete />
        }
      >
        Delete Account
      </Button>
    </Menu>
  );
}

export default UserMenu;
