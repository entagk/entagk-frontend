import React from 'react';
import { Link } from 'react-router-dom';

function MenuItem({ component, children, ...props }) {
  return (
    <>
      {component === Link ? (
        <Link {...props}>
          {children}
        </Link>
      ) : (
        <button
          {...props}
        >
          {children}
        </button>
      )}
    </>
  );
}

export default MenuItem;
