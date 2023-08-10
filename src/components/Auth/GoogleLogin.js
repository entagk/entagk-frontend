import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useDispatch, useSelector } from 'react-redux';
import { authForm } from '../../actions/auth';

import Loading from '../../utils/Loading/Loading';

function GoogleLoginButton({ setMessage, navigate }) {
  const dispatch = useDispatch();
  const { isLoading } = useSelector(state => state.auth);

  const loginUsingGoogle = (res) => {
    dispatch(authForm({ token: res.credential }, "google login", setMessage, navigate));
  }

  return (
    <GoogleOAuthProvider
      clientId="862968573302-7m6ac61q144aoqc1o59po2df6hq50hf0.apps.googleusercontent.com"
    >
      {isLoading && (
        <Loading
          size="small"
          color="#fff"
          backgroud="transparent"
          style={{
            position: 'absolute',
            background: '#ffffff9e',
            width: '100%',
            zIndex: 1001,
            height: "100%",
          }}
        />
      )}
      <GoogleLogin
        text='signin'
        onSuccess={loginUsingGoogle}
        onError={(e) => {
          console.log('Login Failed');
          console.log(e)
        }}
        cookiePolicy='single_host_origin'
        useOneTap
        auto_select
        flow='auth-code'
        type='standard'
        theme='filled_blue'
      />
    </GoogleOAuthProvider>
  );
}

export default GoogleLoginButton;
