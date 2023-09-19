import React, { useEffect, useRef } from 'react';

import "./style.css"

function Menu({ children, setOpen, open, MainButton, ...props }) {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => document.removeEventListener("click", handleClickOutside);
  });

  return (
    <div className="menu" ref={menuRef}>
      {React.cloneElement(MainButton, {
        onClick: () => setOpen(o => !o),
        className: open ? `${MainButton.props.className} open` : MainButton.props.className
      })}
      {
        open && (
          <div className="menu-content" {...props}>
            <div className="row">
              {children.map((child, index) => (
                <React.Fragment key={index}>
                  {child?.type !== 'div' ? (
                    <>
                      {
                        React.cloneElement(child, {
                          onClick: (e) => {
                            child?.props?.onClick(e);
                            setOpen(false);
                          }
                        })
                      }
                    </>
                  ) : child}
                </React.Fragment>
              ))}
            </div>
          </div>
        )
      }
    </div>
  );
}

export default Menu;
