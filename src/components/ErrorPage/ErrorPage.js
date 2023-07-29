import React from 'react';
import { useRouteError, Link } from 'react-router-dom';

import './style.css'
import Button from '../../utils/Button/Button';

function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  const reload = () => {
    window.location.reload();
  }

  return (
    <div className='error-page'>
      <h1>Opps!</h1>
      <div>
        {error.status === 404 && (
          <div>
            <h1 className='error-404'>404</h1>
            <h2>Not found page</h2>
          </div>
        )}
        {error.status !== 404 && (
          <>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
              <i>{error.statusText || error.message}</i>
            </p>
          </>
        )}
        <div className='buttons'>
          {window.location.pathname === '/' ? (
            <Button
              variant='contained'
              onClick={reload}
              style={{
                marginInline: 20
              }}
            >
              reload
            </Button>
          ) : (
            <Button
              component={Link}
              to="/"
              variant='contained'
            >
              go home
            </Button>
          )}
          {(window.location.pathname === '/' || window.history.length > 2) && (
            <Button
              component={Link}
              to={-1}
              variant='outlined'
            >
              go back
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ErrorPage;
