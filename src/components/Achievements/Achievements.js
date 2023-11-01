import React, {
  lazy,
  Suspense,
  useState,
  useEffect
} from 'react';

import Loading from '../../utils/Loading/Loading';
import Message from '../../utils/Message';
import NetworkError from '../NetworkError/NetworkError';
import NoLogin from '../NoLogin/NoLogin';

import './style.css';
import { useSelector } from 'react-redux';

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
        <Loading
          size="verybig"
          backgroud="transperent"
          color="#ffffff"
          className='center-fullpage'
        />
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
