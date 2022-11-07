import React, { useEffect } from 'react';
import { GoogleLogin } from 'react-google-login';
import { gapi, loadAuth2 } from 'gapi-script';
import { useDispatch } from 'react-redux';
import { authForm } from '../../actions/auth';

function GoogleLoginButton({ setMessage, navigate }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const setAuth2 = async () => {
      const auth2 = await loadAuth2(gapi, "862968573302-7m6ac61q144aoqc1o59po2df6hq50hf0.apps.googleusercontent.com", '');

      auth2.attachClickHandler(document.querySelector('.googleLogin'), {},
        (googleUser) => {
          console.log(googleUser);
        }, (error) => {
          console.error(JSON.stringify(error))
        }
      );
    }

    setAuth2();
  }, []);

  const loginUsingGoogle = (res) => {
    console.log(res.tokenId);
    console.log(res.profileObj);
    dispatch(authForm({ token: res.tokenId }, "google login", setMessage, navigate));
  }

  return (
    <GoogleLogin
      clientId="862968573302-7m6ac61q144aoqc1o59po2df6hq50hf0.apps.googleusercontent.com"
      buttonText='Login using google'
      className='googleLogin'
      onSuccess={loginUsingGoogle}
      // onClick={loginUsingGoogle}
      onError={(e) => {
        console.log('Login Failed');
        console.log(e)
      }}
      cookiePolicy='single_host_origin'
    // isSignedIn={true}
    />
  );
}

export default GoogleLoginButton;