import React, { useState } from 'react';

import "./style.css"

function Menu({ children, MainButton, ...props }) {
  const [open, setOpen] = useState(false);

  console.log(children.map(child => child.props?.onClick));

  return (
    <div className="menu">
      {React.cloneElement(MainButton, { onClick: () => setOpen(o => !o), className: open ? `${MainButton.props.className} open` : MainButton.props.className })}
      {
        open && (
          <div className="menu-content" {...props}>
            <div className="row">
              {children.map((child, index) => (
                <React.Fragment key={index}>
                  {React.cloneElement(child, {
                    onClick: (e) => {
                      child.props.onClick(e);
                      setOpen(false);
                    }
                  })}
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
