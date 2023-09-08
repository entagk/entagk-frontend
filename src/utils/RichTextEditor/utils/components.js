import React from "react";
import { useSlate } from "slate-react";
import { isBlockActive, TEXT_ALIGN_TYPES, toggleBlock } from ".";
import iconList from "./icons";

export const Button = React.forwardRef(
  ({ className, active, reversed, ...props }, ref) => (
    <button {...props} ref={ref} />
  )
);

export const Menu = React.forwardRef(({ className, ...props }, ref) => (
  <div {...props} className="toolbar" data-test-id="menu" ref={ref} />
));

export const BlockButton = ({ format, icon, ...props }) => {
  const editor = useSlate();
  const active = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? "align" : "type"
  );
  return (
    <Button
      active={active}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
      {...props}
    >
      <span
        style={{ color: active ? "#000" : "inherit" }}
        className="toolbar-icon"
      >
        {icon !== 'P' ? iconList[icon] : icon}
      </span>
    </Button>
  );
};
