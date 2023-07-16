import React, { useEffect, useState, lazy, Suspense } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { FiEdit3 } from 'react-icons/fi';
import { GrAchievement } from 'react-icons/gr';
import { MdLogout, MdLogin, MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import jwt_decode from "jwt-decode";

import "./style.css";
import {
  getUserData,
  LOGOUT,
  deleteUser,
  refreshToken
} from "../../actions/auth";

import Loading from "../../utils/Loading";
import DeletePopup from "../../utils/DeletePopup/DeletePopup";

const TodoList = lazy(() => import('../../icons/list/TodoList'));
const Menu = lazy(() => import("../../utils/Menu/Menu"));
const MenuItem = lazy(() => import("../../utils/Menu/MenuItem"));

const NavBar = ({ setMessage }) => {
  const [openDelete, setOpenDelete] = useState(false);
  const { started } = useSelector(state => state.timer);
  const { user } = useSelector(state => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem('token') && user === undefined) {
      dispatch(getUserData(setMessage));
      const decodedToken = jwt_decode(localStorage.getItem('token'));
      const tokenExp = ((decodedToken.exp * 1000 - new Date().getTime()) / (1000 * 60 * 60));
      if (localStorage.getItem('token') && tokenExp < 24) {
        dispatch(refreshToken(setMessage));
      }
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (user !== undefined) {
      const decodedToken = jwt_decode(localStorage.getItem('token'));

      if (decodedToken.exp * 1000 < new Date().getTime()) {
        dispatch({ type: LOGOUT });
        console.log(decodedToken.ext * 1000 - new Date().getTime())
      }
    }

    // eslint-disable-next-line
  }, [user]);

  const logout = () => {
    dispatch({ type: LOGOUT });
  };

  const handleDeleteUser = () => {
    setOpenDelete(false);
    dispatch(deleteUser(setMessage));
  }

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

  return (
    <>
      {openDelete && (
        <DeletePopup type={"your account"} onCancel={() => setOpenDelete(false)} onOk={handleDeleteUser} />
      )}
      <nav className="nav-bar">
        <Link to="/">
          <h1>Entagk</h1>
        </Link>
        <div style={{ position: 'relative' }}>
          {!localStorage.getItem('token') ? (
            <Link
              aria-label="login user"
              className={`login ${(started || window.location.pathname === '/auth') ? 'disabled' : ''}`}
              to="/auth"
            >
              <MdLogin />
              <span style={{ marginLeft: 10 }}>
                Login
              </span>
            </Link>
          ) : user ? (
            <>
              <Suspense fallback={<></>}>
                <Menu MainButton={
                  <button
                    aria-label="user button"
                    className="user-menu"
                  >
                    <div className={`user-logo ${user?.avatar && 'img'}`}>
                      {user?.avatar ? (
                        <img src={user?.avatar} alt="avatar" width="" height="" />
                      ) : (
                        <AiOutlineUser />
                      )}
                    </div>
                    <span className="name">{getUserName()}</span>
                  </button>
                }>
                  <MenuItem
                    component={Link}
                    to="/user/achievements"
                    // onClick={toggleMenu}
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
                    // onClick={toggleMenu}
                    aria-label="user button in menu">
                    <TodoList />
                    <span style={{ marginLeft: 10 }}>
                      todos templates
                    </span>
                  </MenuItem>
                  <MenuItem
                    component={Link}
                    to="/user/edit"
                    // onClick={toggleMenu}
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
              </Suspense>
            </>
          ) : (<><Loading size="30" strokeWidth="5" color={"#fff"} backgroud="transparent" paddingBlock='0' /></>)}
        </div>
      </nav>
    </>
  )
}

export default NavBar;
