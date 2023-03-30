import React, { useCallback, useState, lazy } from "react";
import { AiOutlineUser, /*AiOutlineClose*/ } from "react-icons/ai";
// import { HiMenu, HiUser, HiOutlineDocumentReport } from "react-icons/hi";
import { FiEdit3 } from 'react-icons/fi';
import { GrAchievement } from 'react-icons/gr';
// import { FaMoneyCheck } from "react-icons/fa";
import { MdLogout, MdLogin, MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import jwt_decode from "jwt-decode";

import "./style.css";
import { useEffect } from "react";
import { getUserData, LOGOUT, deleteUser, refreshToken } from "../../actions/auth";
import Loading from "../../utils/Loading";
const TodoList = lazy(() => import('../../icons/list/TodoList'));

const NavBar = ({ setMessage }) => {
  const [open, setOpen] = useState(false);
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

  const toggleMenu = useCallback(() => {
    if (open) {
      document.body.style.overflow = "auto";
    } else {
      document.body.style.overflow = "hidden";
    }
    setOpen((o) => !o);
    // eslint-disable-next-line
  }, [open]);

  const logout = () => { dispatch({ type: LOGOUT }); toggleMenu(); };

  const delete_user = () => { setOpenDelete(false); dispatch(deleteUser(setMessage)); }

  const getUserName = () => {
    if (user.name.length <= 18) {
      return user.name;
    } else if (user.name.split(' ').length > 1) {
      return user.name.split(' ')[0];
    } else {
      return user.name.slice(0, 15) + '...';
    }
  }

  return (
    <>
      {openDelete && (
        <div className="glass-container">
          <div className="glass-effect delete-popup">
            <h4>Do you sure you want to delete your account ?</h4>
            <div className="buttons">
              <button aria-label="cancel deleteing account" onClick={() => setOpenDelete(false)} className="cancel">cancel</button>
              <button aria-label="ok deleteing account" onClick={delete_user} className="ok">ok</button>
            </div>
          </div>
        </div>
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
            <button
              aria-label="user button"
              className="user"
              onClick={() => setOpen(o => !o)}
              style={{ boxShadow: open && 'inset 0 0 5px #6f6f6f' }}>
              <div className={`user-logo ${user?.avatar && 'img'}`}>
                {user?.avatar ? (
                  <img src={user.avatar} alt="avatar" width="" height="" />
                ) : (
                  <AiOutlineUser />
                )}
              </div>
              <span className="name">{getUserName()}</span>
            </button>
          ) : (<><Loading size="30" strokeWidth="5" color={"#fff"} backgroud="transparent" paddingBlock='0' /></>)}
          {open && (
            <>
              <div className="menu-content">
                <div className="row">
                  <Link
                    to="/user/achievements"
                    onClick={toggleMenu}
                    aria-label="user button in menu">
                    <GrAchievement />
                    <span style={{ marginLeft: 10 }}>
                      achievements
                    </span>
                  </Link>
                  <Link
                    to="/user/templates"
                    onClick={toggleMenu}
                    aria-label="user button in menu">
                    <TodoList />
                    <span style={{ marginLeft: 10 }}>
                      todos templates
                    </span>
                  </Link>
                  <Link
                    to="/user/edit"
                    onClick={toggleMenu}
                    aria-label="user button in menu">
                    <FiEdit3 />
                    <span style={{ marginLeft: 10 }}>
                      edit account
                    </span>
                  </Link>
                  <button
                    onClick={logout}
                    aria-label="logout button in menu">
                    <MdLogout />
                    <span style={{ marginLeft: 10 }}>
                      Logout
                    </span>
                  </button>
                  <button
                    aria-label="delete account button"
                    onClick={() => setOpenDelete(true)}
                    style={{ color: "red" }}
                  >
                    <MdDelete />
                    <span style={{ marginLeft: 10 }}>Delete Account</span>
                  </button>
                </div>
              </div>
              <div onClick={toggleMenu} style={{
                height: "100%",
                width: "100%"
              }}></div>
            </>
          )}
        </div>
      </nav>
    </>
  )
}

export default NavBar;
