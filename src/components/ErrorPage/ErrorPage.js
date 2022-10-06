import React from 'react';
import { useRouteError, Link } from 'react-router-dom';

function ErrorPage(props) {
  const error = useRouteError();
  console.error(error);

  return (
    <div id='error-page'>
      <h1>Opps!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
      <button>
        <Link to='/'>
          go to home
        </Link>
      </button>
    </div>
  );
}

export default ErrorPage;