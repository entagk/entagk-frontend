import React, { lazy, Suspense, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { getTemplatesForUser } from '../../actions/templates';

import Loading from '../../utils/Loading';
import Message from '../../utils/Message';
import NetworkError from '../NetworkError/NetworkError';
import NoLogin from '../NoLogin/NoLogin';

import './style.css';

const NavBar = lazy(() => import('../NavBar/NavBar'));
const Template = lazy(() => import('./Template/Template.js'));

function Templates() {
  const dispatch = useDispatch();
  const [message, setMessage] = useState({ message: "", type: "" })
  const [isLoading, setIsLoading] = useState(null);
  const { userTemplates: { templates, total } } = useSelector(state => state.templates) || {};

  useEffect(() => {
    if (localStorage.getItem('token')) {
      if (total === undefined && templates === undefined) {
        dispatch(getTemplatesForUser(1, setMessage));
      }
    }
    // eslint-disable-next-line
  }, [total]);

  if (templates === undefined && localStorage.getItem('token')) {
    return (
      <>
        {(!message.message) ?
          (
            <>
              <Loading
                size="100"
                strokeWidth="5"
                backgroud="transperent"
                color="#ffffff"
              />
            </>
          ) : (
            <>
              {(message.message && !message.message.includes('Network Error')) ? (
                <Message {...message} setMessage={setMessage} />
              ) : (
                <NetworkError />
              )}
            </>
          )
        }
      </>
    )
  }

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
          size="200"
          strokeWidth="5px"
          backgroud="transperent"
          color="#ffffff"
        />
      }>
        <NavBar />
        <div className='container'>
          <div className='templates-container'>
            {templates?.map((temp) => (
              <Template
                {...temp}
                key={temp._id}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                setMessage={setMessage}
              />
            ))}
          </div>
        </div>
      </Suspense>
    </>
  );
}

export default Templates;
