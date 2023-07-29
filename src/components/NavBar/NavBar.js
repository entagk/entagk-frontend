import React, { useEffect, useState, lazy, Suspense } from "react";
import { MdLogin } from "react-icons/md";
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

import Loading from "../../utils/Loading/Loading";
import Button from "../../utils/Button/Button";

const DeletePopup = lazy(() => import("../../utils/DeletePopup/DeletePopup"));
const UserMenu = lazy(() => import('./UserMenu.js'))

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

  const handleDeleteUser = () => {
    setOpenDelete(false);
    dispatch(deleteUser(setMessage));
  }

  return (
    <>
      {openDelete && (
        <Suspense fallback={
          <div className="glass-container">
            <Loading
              size="medium"
              color={"#fff"}
              backgroud="transparant"
              className={"glass-effect delete-popup"}
            />
          </div>
        }>
          <DeletePopup
            type={"your account"}
            onCancel={() => setOpenDelete(false)}
            onOk={handleDeleteUser}
          />
        </Suspense>
      )}
      <nav className="nav-bar">
        <Link to="/">
          <h1>Entagk</h1>
        </Link>
        <div style={{ position: 'relative' }}>
          {!localStorage.getItem('token') ? (
            <>
              <Button
                aria-label="login user"
                component={Link}
                startIcon={<MdLogin />}
                variant="contained"
                className={`login ${(started || window.location.pathname === '/auth') ? 'disabled' : ''}`}
                to="/auth"
              >
                Login
              </Button>
            </>
          ) : user ? (
            <>
              <Suspense fallback={
                <>
                  <Loading
                    size="small"
                    color={"#fff"}
                    backgroud="transparent"
                    paddingBlock='0'
                  />
                </>
              }>
                <UserMenu setOpenDelete={setOpenDelete} />
              </Suspense>
            </>
          ) : (
            <>
              <Loading
                size="small"
                color={"#fff"}
                backgroud="transparent"
                paddingBlock='0'
              />
            </>
          )}
        </div>
      </nav>
    </>
  )
}

export default NavBar;
