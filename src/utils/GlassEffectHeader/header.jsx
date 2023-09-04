import React from "react";

import './style.css';

const Header = ({
  className = "",
  title = "",
  LeftButton = <></>,
  showLeft = false,
  RightButton = <></>
}) => {
  return (
    <>
      <div className={`${className} header`}>
        <div className="left-side">
          {showLeft && (
            <>
              {
                /* cloneElement: this method for clone the react element */
                React.cloneElement(LeftButton)
              }
            </>
          )}
          <h2>{title}</h2>
        </div>
        {
          /* cloneElement: this method for clone the react element */
          React.cloneElement(RightButton)
        }
      </div>
    </>
  )
}

export default Header;
