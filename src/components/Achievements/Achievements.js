import React, {
  lazy,
  Suspense,
  useState
} from 'react';

import Loading from '../../utils/Loading/Loading';
import Message from '../../utils/Message';
import NetworkError from '../NetworkError/NetworkError';
import NoLogin from '../NoLogin/NoLogin';

import './style.css';

const NavBar = lazy(() => import('../NavBar/NavBar'));
const Summary = lazy(() => import('./Summary'));

const Achievements = () => {
  const [message, setMessage] = useState({ message: "", type: "" });

  if (!localStorage.getItem('token')) {
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
          </div>
        </div>
      </Suspense>
    </>
  )
}

export default Achievements;
