import React, { useState }/*, { lazy }*/ from "react";
import { useSelector } from "react-redux";

import "./Auth.css";

// const NavBar = lazy(() => import("./../NavBar/NavBar"));
const Auth = () => {
  const { activites, active } = useSelector(state => state.timer);
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div>
      <div className="container">
        {/* <NavBar /> */}
        <div className={`auth-page ${isSignUp ? "right-panel-active" : "left-panel-active"}`}>
          <div className={`form-container ${isSignUp ? 'sign-up' : 'sign-in'}`}>
            <form>
              <p>form</p>
            </form>
          </div>
          <div className="overlay-container">
            <div className="overlay" style={{ backgroundImage: `linear-gradient(270deg, ${activites[active].timerBorder}, ${activites[active].color})` }}>
              <div className={`overlay-panel ${isSignUp ? "overlay-left" : "overlay-right"}`}>
                <div className="text-container">
                  <h1>
                    {isSignUp ? "Hello, Friend!" : "Welcome Back!"}
                  </h1>
                  <p>
                    {isSignUp ? "Enter your personal details and start journey with us" : "To keep connected with us please login with your personal info"}
                  </p>
                </div>
                <button aria-label="form toggole button" onClick={() => setIsSignUp((p) => !p)}>{isSignUp ? "sign in" : "sign up"}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Auth;