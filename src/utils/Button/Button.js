import React from 'react';
import { Link } from 'react-router-dom';

import './style.css';

function Button({
  children,
  variant = 'contained',
  component,
  startIcon,
  endIcon,
  color,
  ...props
}) {
  return (
    <>
      {component === Link ? (
        <Link
          {...props}
          className={`${variant} ${props.className}`}
        >
          {startIcon && (
            <span className='start icon'>
              {startIcon}
            </span>
          )}
          {children && (
            <span
              style={{
                marginInline: startIcon && endIcon ?
                  10 :
                  startIcon ?
                    '10px 0' :
                    endIcon ?
                      '0 10px' :
                      0,
              }}
            >
              {children}
            </span>
          )}
          {endIcon && (
            <span className='end icon'>
              {endIcon}
            </span>
          )}
        </Link>
      ) : (
        <button
          {...props}
          className={`${variant} ${props.className} ${color}`}
        >
          {startIcon && (
            <span className='start icon' >
              {startIcon}
            </span>
          )}
          {children && (
            <span
              style={{
                marginInline: startIcon && endIcon ?
                  10 :
                  startIcon ?
                    '10px 0' :
                    endIcon ?
                      '0 10px' :
                      0,
              }}
            >
              {children}
            </span>
          )}
          {endIcon && (
            <span className='end icon'>
              {endIcon}
            </span>
          )}
        </button>
      )}
    </>
  );
}

export default Button;
