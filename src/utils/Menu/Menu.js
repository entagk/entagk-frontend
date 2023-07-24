import React, { useState } from 'react';

import "./style.css"

function Menu({ children, MainButton, ...props }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="menu">
      {React.cloneElement(MainButton, { onClick: () => setOpen(o => !o), className: open ? `${MainButton.props.className} open` : MainButton.props.className })}
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
                            child.props.onClick(e);
                            setOpen(false);
                          }
                        })
                      }
                    </>
                  ): child}
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
