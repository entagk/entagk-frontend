import React from 'react';
import { useRouteError, Link } from 'react-router-dom';

import './syle.css'
import Button from '../../utils/Button/Button';

function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div className='error-page'>
      <h1>Opps!</h1>
      <div style={{
        width: '100%',
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}>
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
          {/* if the location is / then, show reload not go to bome */}
          <Button
            component={Link}
            to="/"
            variant='contained'
          >
            go home
          </Button>
          {/* if the location is / or length is 1 then, don't show go back else, go backreload not go to bome */}
          <Button
            component={Link}
            to={-1}
            variant='outlined'
          >
            go back
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ErrorPage;
