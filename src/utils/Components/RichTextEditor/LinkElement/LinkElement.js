import React from "react";
import { useFocused, useSelected, useSlateStatic } from "slate-react";

import iconList from "../utils/icons";
import { removeLink } from "../utils/link";
import "./style.css";

const Link = ({ attributes, element, children }) => {
  const editor = useSlateStatic();
  const selected = useSelected();
  const focused = useFocused();

  return (
    <div className="link">
      <a
        href={element.href}
        {...attributes}
        {...element.attr}
        target={element.target}
      >
        {children}
      </a>
      {selected && focused && (
        <div className="link-popup" contentEditable={false}>
          <a href={element.href} target={element.target}>
            {element.href}
          </a>
          <button onClick={() => removeLink(editor)}>
            {iconList["unlink"]}
          </button>
        </div>
      )}
    </div>
  );
};

export default Link;
