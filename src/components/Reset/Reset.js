import React, { Suspense, lazy, useState, useEffect } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { resetPassword, verifyResetToken } from '../../actions/auth';
import Loading from '../../utils/Loading/Loading';
import Message from '../../utils/Message';
import LogoutPage from '../Auth/LogoutPage/LogoutPage';

import './../Auth/Auth.css';
import NotValidToken from './NotValidToken';
import NetworkError from '../NetworkError/NetworkError';
import Button from '../../utils/Button/Button';

const NavBar = lazy(() => import('./../NavBar/NavBar'));
const Password = lazy(() => import('./../Auth/Password/Password'))

function Reset() {
  const { tokenId } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState({ message: '', type: '' });
  const [validate, setValidate] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' })
  const [passowordShow, setPasswordShow] = useState({
    password: false, confirmPassword: false
  });

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const handlePasswordShowing = (type) => {
    setPasswordShow({ ...passowordShow, [type]: !passowordShow[type] });
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
                <Password
                  passowordShow={passowordShow}
                  formData={formData}
                  type="password"
                  handleChange={handleChange}
                  onClick={handlePasswordShowing}
                />
                <Password
                  passowordShow={passowordShow}
                  formData={formData}
                  type="confirmPassword"
                  handleChange={handleChange}
                  onClick={handlePasswordShowing}
                />
              </div>
              <div className="block">
                <Button
                  aria-label="submit auth data"
                  type="submit"
                  disabled={
                    isLoading ||
                    !formData.password ||
                    !formData.confirmPassword ||
                    formData.password !== formData.confirmPassword
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
