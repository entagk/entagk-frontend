import React, { lazy, Suspense, useState } from "react";
import { useSelector } from "react-redux";
import Loading from "../../utils/Loading";

import "./Auth.css";
import Password from "./Password";

const NavBar = lazy(() => import("./../NavBar/NavBar"))
const initialFormData = {
  name: "",
  email: "",
  password: "",
  confirmPassword: ""
};

const Auth = () => {
  const { activites, active } = useSelector(state => state.timer);
  const [isSignUp, setIsSignUp] = useState(false);
  const [forgetPassword, setForgetPassword] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [passowordShow, setPasswordShow] = useState({
    password: false, confirmPassword: false
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // eslint-disable-next-line
  const emailPattern = "[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$";

  const validateEmail = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

  const handlePasswordShowing = (type) => {
    setPasswordShow({ ...passowordShow, [type]: !passowordShow[type] });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  }

  return (
    <Suspense fallback={
      <Loading
        backgroud="transparent"
        width="200"
        height="200"
        cx="50"
        cy="50"
        r="20"
        strokeWidth="2.5"
        color="#ffffff"
        containerHeight="500px"
      />
    }>
      <div>
        <div className="container">
          <NavBar />
          <div className={`auth-page ${isSignUp ? "right-panel-active" : "left-panel-active"}`}>
            <div className={`form-container ${isSignUp ? 'sign-up' : 'sign-in'}`}>
              <form onSubmit={handleSubmit}>
                <h1>{isSignUp ? "create account" : "sing in"}</h1>
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
                  <Password
                    passowordShow={passowordShow}
                    formData={formData}
                    type="password"
                    handleChange={handleChange}
                    onClick={handlePasswordShowing}
                  />
                  {!isSignUp && (
                    <button aria-label="forget password button" className="forget-password">forget password</button>
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
                  <button
                    type="submit"
                    disabled={isSignUp ?
                      (!formData.name || !formData.email || !formData.password || (formData.password !== formData.confirmPassword)) :
                      (!formData.email || !formData.password)
                    }>{isSignUp ? "sign up" : 'sign in'}</button>
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
                  </div>
                  <button
                    type="button"
                    style={{ backgroundColor: "#00000031" }}
                    aria-label="form toggole button"
                    onClick={() => setIsSignUp((p) => !p)}
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