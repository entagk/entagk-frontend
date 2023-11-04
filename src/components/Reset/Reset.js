import React, { Suspense, lazy, useState, useEffect } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { resetPassword, verifyResetToken } from '../../actions/auth';
import Loading from '../../utils/Loading/Loading';
import Message from '../../utils/Message';
import LogoutPage from '../Auth/LogoutPage/LogoutPage';

import '../Auth/AuthForm/style.css';
import NotValidToken from './NotValidToken/NotValidToken';
import NetworkError from '../NetworkError/NetworkError';
import Button from '../../utils/Button/Button';

const NavBar = lazy(() => import('./../NavBar/NavBar'));
const Input = lazy(() => import('../../utils/Input/Input'));

function Reset() {
  const { tokenId } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState({ message: '', type: '' });
  const [validate, setValidate] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' })

  const requiredFields = ['confirmPassword', 'password'];
  const [formErrors, setFormError] = useState({});

  const validations = {
    password: (p) => {
      if (p.length < 8) {
        setFormError(fE => ({ ...fE, password: "The password must be at least 8 letters and numbers" }));
        return true;
      } else {
        setFormError(fE => ({ ...fE, password: "" }));
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
  };

  useEffect(() => {
    document.body.classList.remove('home');

    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    localStorage.setItem('reset-token', tokenId);
    verifyResetToken(setMessage, setValidate, setIsLoading)
  }, [tokenId]);

  if (localStorage.getItem('token')) {
    return (
      <LogoutPage />
    )
  }

  if (validate === false) {
    return (
      <NotValidToken
        message={message.message}
      />
    )
  }

  if (validate === undefined && isLoading) {
    return (
      <Loading
        size="verybig"
        backgroud="transperent"
        color="#ffffff"
        className="center-fullpage"
      />
    )
  }

  const handleSubmit = async (e) => {
    await e.preventDefault();
    console.log(formData);

    if (formData.password !== formData.confirmPassword || formData.password.length < 8) {
      setMessage({ message: "Please complete the data of the reest form", type: 'error' })
    }

    await resetPassword(formData, setMessage, setIsLoading);
    await navigate('/auth');
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
        <div style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBlock: '25px',
        }}>
          <div className='form-container reset-form'>
            <form onSubmit={handleSubmit}>
              <h1>reset password</h1>
              <div className='block'>
                <Input
                  name="password"
                  type="password"
                  placeholder="password"
                  aria-label="password"
                  {...requiredForEveryInput}
                />
                <Input
                  name="confirmPassword"
                  type="password"
                  placeholder="confirm password"
                  aria-label="confirm password"
                  {...requiredForEveryInput}
                />
              </div>
              <div className="block">
                <Button
                  aria-label="submit auth data"
                  type="submit"
                  disabled={
                    isLoading ||
                    Object.values(formErrors).filter(fE => fE.length > 0).length > 0
                  }>
                  {
                    isLoading ?
                      <Loading
                        size="small"
                        strokeWidth="5px"
                        color={"#fff"}
                        backgroud="transparent"
                        style={{ margin: 0 }}
                      />
                      : 'reset password'
                  }
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Suspense>
  );
}

export default Reset;
