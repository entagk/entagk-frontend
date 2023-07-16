import React from 'react';

function MainButton({ children, ...props }) {
  
  return (
    <>
      <button
        {...props}
      >
        {children}
      </button>
    </>
  );
}

export default MainButton;
