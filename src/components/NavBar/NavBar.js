import React, { useCallback, useState } from "react";
import { AiOutlineUser, AiOutlineSetting, AiOutlineClose } from "react-icons/ai";
import { HiMenu, HiUser/*, HiOutlineDocumentReport*/ } from "react-icons/hi";
// import { FaMoneyCheck } from "react-icons/fa";
import { MdLogout, MdLogin, MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import jwt_decode from "jwt-decode";

import "./style.css";
import { useEffect } from "react";
import { getUserData, LOGOUT, deleteUser, refreshToken } from "../../actions/auth";

const NavBar = ({ setMessage }) => {
  const [open, setOpen] = useState(false);
  const { started, setting } = useSelector(state => state.timer);
  const { user } = useSelector(state => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem('token') && user === undefined) {
      dispatch(getUserData(setMessage));
      dispatch(refreshToken(setMessage));
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

  const delete_user = () => { dispatch(deleteUser(setMessage)); toggleMenu() }

  return (
    <>
      <div className="nav-bar">
        <Link to="/">
          <h1 style={{ color: "#fff" }}>Entagk</h1>
        </Link>
        <div>
          <button
            aria-label="toggle menu button"
            style={{ display: (setting?.focusMode && started) && "none" }}
            className="toggle-menu" onClick={toggleMenu} disabled={started}>
            <HiMenu />
          </button>
        </div>
        {open && (
          <div className="menu-overflow">
            <div className="menu-content">
              <div className="close-container">
                <button
                  aria-label="close button for menu"
                  className="close-button"
                  onClick={toggleMenu}
                >
                  <AiOutlineClose />
                </button>
              </div>
              {user && (
                <div className="user-data" style={{ marginBottom: user && '15px' }}>
                  <div className="user-avatar" style={{ backgroundImage: `url(${user?.avatar})` }}>
                    {!user?.avatar &&
                      (
                        <AiOutlineUser />
                      )
                    }
                  </div>
                  <p>{user?.name}</p>
                </div>
              )}
              <div className="row" style={{
                paddingBottom: "15px"
              }}>
                <Link
                  style={{ padding: user && '10px 16px 10px 30px' }}
                  to={`${user ? "/profile" : "/auth"}`}
                  onClick={toggleMenu}
                  aria-label="user button in menu">
                  {user ? (
                    <HiUser />
                  ) : (<MdLogin />)}
                  <p style={{ marginLeft: 10 }}>
                    {user ? "Profile" : "Login"}
                  </p>
                </Link>
                {/* {user && (
                  <Link
                    to="/subsecription"
                    style={{ padding: user && '10px 16px 10px 30px' }}
                    onClick={toggleMenu}
                    aria-label="subsecription button in menu">
                    <FaMoneyCheck />
                    <p style={{ marginLeft: 10 }}>
                      Subsecription
                    </p>
                  </Link>
                )} */}
                <Link
                  to="/setting"
                  style={{ padding: user && '10px 16px 10px 30px' }}
                  onClick={toggleMenu}
                  aria-label="setting button in menu">
                  <AiOutlineSetting />
                  <p style={{ marginLeft: 10 }}>
                    Setting
                  </p>
                </Link>
                {/* <Link
                  to="/report"
                  style={{ padding: user && '10px 16px 10px 30px' }}
                  onClick={toggleMenu}
                  aria-label="report button in menu">
                  <HiOutlineDocumentReport />
                  <p style={{ marginLeft: 10 }}>
                    Report
                  </p>
                </Link> */}
                {user && (
                  <button
                    onClick={logout}
                    style={{ padding: user && '10px 16px 10px 30px' }}
                    aria-label="logout button in menu">
                    <MdLogout />
                    <p style={{ marginLeft: 10 }}>
                      Logout
                    </p>
                  </button>
                )}
              </div>
              {user && (
                <div className="row" style={{ marginTop: user && '20px' }}>
                  <button
                    aria-label="delete account button"
                    onClick={delete_user}
                    style={{ padding: user && '10px 16px 10px 30px' }}>
                    <MdDelete />
                    <p style={{ marginLeft: 10 }}>Delete Account</p>
                  </button>
                </div>
              )}
            </div>
            <div onClick={toggleMenu} style={{
              height: "100%",
              width: "100%"
            }}></div>
          </div>
        )}
      </div>
    </>
  )
}

export default NavBar;
