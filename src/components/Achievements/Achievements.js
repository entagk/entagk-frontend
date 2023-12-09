import React, {
  lazy,
  Suspense,
  useState,
  useEffect
} from 'react';
import { useSelector } from 'react-redux';

import Message from '../../utils/Components/Message/Message';
import NetworkError from '../NetworkError/NetworkError';
import NoLogin from '../NoLogin/NoLogin';

import './style.css';

const NavBar = lazy(() => import('../NavBar/NavBar'));
const Summary = lazy(() => import('./Summary/Summary'));
const Analytics = lazy(() => import('./Analytics/Analytics'));

const Achievements = () => {
  const [message, setMessage] = useState({ message: "", type: "" });
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    document.body.classList.remove('home');

    // eslint-disable-next-line
  }, [])

  if (!localStorage.getItem('token') || (!user?._id && !localStorage.getItem('token'))) {
    return (
      <NoLogin />
    )
  }

  return (
    <>
      {message.message && (
        <>
          {(!message.message.includes('Network Error')) ? (
            <Message {...message} setMessage={setMessage} />
          ) : (
            <NetworkError />
          )}
        </>
      )}
      <Suspense fallback={
        <div className='center-fullpage' style={{ color: "#fff" }}>
          <div className='home-loading'>
            <p>loading...</p>
          </div>
        </div>
      }>
        <div className='container'>
          <NavBar />
          <div className='achievements-container'>
            <Summary />
            <Analytics setMessage={setMessage} />
          </div>
        </div>
      </Suspense>
    </>
  )
}

export default Achievements;
