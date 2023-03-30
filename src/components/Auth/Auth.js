import React, { lazy, Suspense, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authForm } from "../../actions/auth";
import Loading from "../../utils/Loading";
import Message from '../../utils/Message';

import GoogleLogin from './GoogleLogin'

import "./Auth.css";
import Password from "./Password";
import LogoutPage from "./LogoutPage";
import NetworkError from "../NetworkError/NetworkError";

const NavBar = lazy(() => import("./../NavBar/NavBar"));
const initialFormData = {
  name: "",
  email: "",
  password: "",
  confirmPassword: ""
};

const Auth = () => {
  const dispatch = useDispatch();
  const { isLoading, user } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const { activites, active } = useSelector(state => state.timer);
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState({ type: '', message: '' })
  const [forgetPassword, setForgetPassword] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [passowordShow, setPasswordShow] = useState({
    password: false, confirmPassword: false
  });

  if (user) {
    return (
      <LogoutPage />
    )
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // eslint-disable-next-line
  const emailPattern = "[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$";

  const validateEmail = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

  const handlePasswordShowing = (type) => {
    setPasswordShow({ ...passowordShow, [type]: !passowordShow[type] });
  }

  const handleSubmit = async (e) => {
    await e.preventDefault();
    console.log(formData);

    if (isSignUp) {
      if (!formData.email || !formData.name || formData.confirmPassword !== formData.password) {
        setMessage({ type: 'error', message: 'Please complete all form data' });
      } else {
        dispatch(authForm(formData, 'sign up', setMessage, navigate));
      }
    } else if (forgetPassword) {
      if (!formData.email) {
        setMessage({ type: 'error', message: 'Please complete all form data' });
      } else {
        dispatch(authForm({ email: formData.email }, 'forget password', setMessage, navigate));
      }
    } else {
      if (!formData.email || !formData.password) {
        setMessage({ type: 'error', message: 'Please complete all form data' });
      } else {
        dispatch(authForm({ password: formData.password, email: formData.email }, 'sign in', setMessage, navigate));
      }
    }
  }

  if (message.message === 'Network Error') {
    return (
      <div>
        <h2>There is no Internet Connection</h2>
      </div>
    )
  }

  return (
    <Suspense fallback={
      <Loading
        size="200"
        strokeWidth="5"
        color="#ffffff"
        backgroud="transperent"
      />
    }>
      {isLoading && (
        <div className="loading-container" style={{
          position: 'fixed',
          top: '0',
          right: '0',
          background: '#ffffff73',
          width: '100%',
          height: '100%',
          zIndex: '1000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Loading
            size="200"
            strokeWidth="5"
            color={activites[active].color}
            backgroud="transperent"
          />
        </div>
      )}
      <div>
        <div className="container">
          <NavBar setMessage={setMessage} />
          {message.message && (
            <>
              {(!message.message.includes('Network Error')) ? (
                <Message {...message} setMessage={setMessage} />
              ) : (
                <NetworkError />
              )}
            </>
          )}
          <div className={`auth-page ${isSignUp ? "right-panel-active" : "left-panel-active"}`}>
            <div className={`form-container ${isSignUp ? 'sign-up' : 'sign-in'}`}>
              <form onSubmit={handleSubmit}>
                <h1>{isSignUp ? "create account" : forgetPassword ? "foget password" : "sing in"}</h1>
                <div className="block">
                  {isSignUp && (
                    <input
                      name="name"
                      type="name"
                      placeholder="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={!formData.name ? 'error' : undefined}
                    />
                  )}
                  <input
                    name="email"
                    type="email"
                    pattern={emailPattern}
                    required
                    placeholder="email"
                    value={formData.email}
                    className={(!formData.email || (validateEmail.test(formData.email) === false)) ? 'error' : undefined}
                    onChange={handleChange}
                  />
                  {!forgetPassword && (
                    <Password
                      passowordShow={passowordShow}
                      formData={formData}
                      type="password"
                      handleChange={handleChange}
                      onClick={handlePasswordShowing}
                    />
                  )}
                  {!isSignUp && (
                    <div style={{
                      width: '100%',
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start"
                    }}>
                      <button
                        aria-label="forget password button"
                        className="forget-password"
                        type="button"
                        onClick={() => setForgetPassword(fp => !fp)}
                      >forget password</button>
                    </div>
                  )}
                  {isSignUp && (
                    <Password
                      passowordShow={passowordShow}
                      formData={formData}
                      type="confirmPassword"
                      handleChange={handleChange}
                      onClick={handlePasswordShowing}
                    />
                  )}
                </div>
                <div className="block">
                  <GoogleLogin setMessage={setMessage} navigate={navigate} />
                </div>
                <div className="block">
                  <button
                    aria-label="submit auth data"
                    type="submit"
                    disabled={isSignUp ?
                      (!formData.name || !formData.email || !formData.password || (formData.password !== formData.confirmPassword)) :
                      forgetPassword ? (!formData.email) : (!formData.email || !formData.password)
                    }>{isLoading ? "loading..." : isSignUp ? "sign up" : forgetPassword ? 'send mail' : 'sign in'}</button>
                </div>
              </form>
            </div>
            <div className="overlay-container">
              <div
                className="overlay"
                style={{ backgroundImage: `linear-gradient(270deg, ${activites[active].timerBorder}, ${activites[active].color})` }}>
                <div className={`overlay-panel ${isSignUp ? "overlay-left" : "overlay-right"}`}>
                  <div className="text-container">
                    <h1>
                      {isSignUp ? "Hello, Friend!" : "Welcome Back!"}
                    </h1>
                    <p>
                      {isSignUp ?
                        "Enter your personal details and start journey with us" :
                        "To keep connected with us please login with your personal info"
                      }
                    </p>
                    <h3>{isSignUp ? "Already have account" : "Don't have account ?"}</h3>
                  </div>
                  <button
                    type="button"
                    style={{ backgroundColor: "#00000031" }}
                    aria-label="form toggole button"
                    onClick={() => { setIsSignUp((p) => !p); setForgetPassword(false); }}
                  >
                    {isSignUp ? "sign in" : "sign up"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  )
}

export default Auth;
