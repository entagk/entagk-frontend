import React from "react";

export const Button = React.forwardRef(
  ({ className, active, reversed, ...props }, ref) => (
    <button {...props} ref={ref} />
  )
);

export const Menu = React.forwardRef(({ className, ...props }, ref) => (
  <div {...props} className="toolbar" data-test-id="menu" ref={ref} />
));
