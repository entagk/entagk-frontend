import React, { lazy, Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authForm } from "../../actions/auth";
import Loading from "../../utils/Loading/Loading";
import Message from '../../utils/Message';

import GoogleLogin from './GoogleLogin'

import "./Auth.css";
import LogoutPage from "./LogoutPage/LogoutPage";
import NetworkError from "../NetworkError/NetworkError";
import Button from "../../utils/Button/Button";

const NavBar = lazy(() => import("./../NavBar/NavBar"));
const Input = lazy(() => import("../../utils/Input/Input"));
const initialFormData = {
  name: "",
  email: "",
  password: "",
  confirmPassword: ""
};

const Auth = () => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState({ type: '', message: '' })
  const [forgetPassword, setForgetPassword] = useState(false);
  const [formData, setFormData] = useState(initialFormData);

  const [formErrors, setFormError] = useState({});
  const [validations, setValidations] = useState({
    email: (e) => {
      const validateEmail = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
      if (!validateEmail.test(e)) {
        setFormError(fE => ({ ...fE, email: 'This email is invalid' }));
        return true;
      } else {
        setFormError(fE => ({ ...fE, email: '' }));
        return false;
      }
    },
    password: (p, cP) => {
      if (p.length < 8) {
        setFormError(fE => ({ ...fE, password: "The password must be at least 8 letters and numbers" }));
        return true;
      } else {
        setFormError(fE => ({ ...fE, password: "" }));
        return false;
      }
    },
  });

  const [requiredFields, setRequiredFields] = useState(['email', 'password']);
  const signUpRequired = ['name', 'confirmPassword'];

  useEffect(() => {
    if (isSignUp) {
      setRequiredFields(pF => [...pF, ...signUpRequired])
      setValidations(pV => ({
        ...pV,
        name: (n) => {
          if (n.trim().length === 0) {
            setFormError(fE => ({ ...fE, name: "This field is required" }))
            return true;
          } else {
            setFormError(fE => ({ ...fE, name: "" }))
            return false;
          }
        },
        confirmPassword: (cP, p) => {
          if (cP !== p) {
            setFormError(fE => ({ ...fE, confirmPassword: "The password should be matched" }))
            return true;
          } else {
            setFormError(fE => ({ ...fE, confirmPassword: "" }))
            return false;
          }
        },
      }))
    } else {
      if (forgetPassword) {
        setRequiredFields(['email']);
        setFormData({ email: formData.email });
        setFormError({ emali: formErrors.email });
      } else {
        setRequiredFields(pF => pF.filter(f => !signUpRequired.includes(f)));
        signUpRequired.forEach((f) => {
          const newData = formData;
          delete newData[f];
          setFormData(newData);

          const newFormErrors = formErrors;
          delete newFormErrors[f];
          setFormError(newFormErrors);
        })
      }
    }

    // eslint-disable-next-line
  }, [isSignUp])

  if (localStorage.getItem('token')) {
    return (
      <LogoutPage />
    )
  }

  // eslint-disable-next-line
  const emailPattern = "[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$";

  const handleSubmit = async (e) => {
    await e.preventDefault();
    console.log(formData);

    const dataEntries = Object.entries(formData);
    const errors = Object.entries(formErrors).filter(([k, v]) => v.length > 0);
    dataEntries.forEach(([k, v]) => {
      if (v === '' && requiredFields.includes(k)) {
        errors.push([k, 'This is required']);
        setFormError(fep => ({ ...fep, [k]: 'This is required' }));
      }

      if (!k.includes('confirm')) {
        if (validations[k](v)) {
          errors.push([k, `invalid ${k}`]);
        }
      } else {
        if (validations[k](v)) {
          errors.push([k, `invalid ${k}`]);
        }
      }
    });

    if (isSignUp) {
      if (errors.length === 0) {
        dispatch(authForm(formData, 'sign up', setMessage, navigate));
      }
    } else if (forgetPassword) {
      if (errors.length === 0) {
        dispatch(authForm({ email: formData.email }, 'forget password', setMessage, navigate));
      }
    } else {
      if (errors.length === 0) {
        dispatch(authForm({ password: formData.password, email: formData.email }, 'sign in', setMessage, navigate));
      }
    }
  }

  if (message.message === 'Network Error') {
    return (
      <NetworkError />
    )
  }

  const requiredForEveryInput = {
    formErrors: formErrors,
    setFormError: setFormError,
    validations: validations,
    formData: formData,
    setFormData: setFormData,
    requiredFields: requiredFields,
  }

  return (
    <Suspense fallback={
      <Loading
        size="verybig"
        backgroud="transperent"
        color="#ffffff"
        className="center-fullpage"
      />
    }>
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
                    <Input
                      {...requiredForEveryInput}
                      name="name"
                      type="text"
                      placeholder="name"
                      validations={validations}
                    />
                  )}
                  <Input
                    name="email"
                    type="email"
                    pattern={emailPattern}
                    placeholder="email"
                    {...requiredForEveryInput}
                  />
                  {!forgetPassword && (
                    <Input
                      {...requiredForEveryInput}
                      name="password"
                      type="password"
                      placeholder="password"
                    />
                  )}
                  {isSignUp && (
                    <Input
                      {...requiredForEveryInput}
                      name="confirmPassword"
                      type="password"
                      placeholder="confirm password"
                    />
                  )}
                  {!isSignUp && (
                    <div className="forget-password-container">
                      <Button
                        variant="text"
                        aria-label="forget password button"
                        className="forget-password"
                        type="button"
                        onClick={() => setForgetPassword(fp => !fp)}
                      >forget password</Button>
                    </div>
                  )}
                </div>
                <div className="block">
                  <GoogleLogin
                    setMessage={setMessage}
                    navigate={navigate}
                  />
                </div>
                <div className="block">
                  <Button
                    aria-label="submit auth data"
                    type="submit"
                    disabled={
                      isLoading || Object.values(formErrors).filter(fE => fE.length > 0).length > 0
                    }
                    style={{ paddingBlock: isLoading && 5, color: '#fff', backgroud: 'var(--main-color)', textTransform: 'uppercase' }}
                  >
                    {isLoading ?
                      <Loading
                        size="small"
                        strokeWidth="5px"
                        color={"#fff"}
                        backgroud="transparent"
                        style={{ margin: 0 }}
                      />
                      : isSignUp ?
                        "sign up" :
                        forgetPassword ?
                          'send mail' :
                          'sign in'
                    }
                  </Button>
                </div>
              </form>
            </div>
            <div className="overlay-container">
              <div
                className="overlay"
                style={{ backgroundImage: `linear-gradient(270deg, var(--secondary-color), var(--main-color))` }}>
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
                  <Button
                    type="button"
                    style={{ backgroundColor: "#fff", color: 'var(--main-color)' }}
                    aria-label="form toggole button"
                    onClick={() => { setIsSignUp((p) => !p); setForgetPassword(false); }}
                  >
                    {isSignUp ? "sign in" : "sign up"}
                  </Button>
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
