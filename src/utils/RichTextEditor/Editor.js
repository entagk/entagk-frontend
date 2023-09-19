import React, { useCallback, useMemo, useRef } from "react";
import isHotkey from "is-hotkey";
import { Editable, withReact, Slate } from "slate-react";
import { createEditor } from "slate";

import { toggleMark } from "./utils";

import Link from "./LinkElement/LinkElement";
import Toolbar from "./Toolbar/Toolbar";

import './style.css'

const HOTKEYS = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code"
};

const Element = (props) => {
  const { attributes, children, element } = props;
  const style = { textAlign: element.align };
  switch (element.type) {
    case "block-quote":
      return (
        <blockquote style={style} {...attributes}>
          {children || ""}
        </blockquote>
      );
    case "bulleted-list":
      return (
        <ul style={style} {...attributes}>
          {children || ""}
        </ul>
      );
    case "heading-one":
      return (
        <h1 style={style} {...attributes}>
          {children || ""}
        </h1>
      );
    case "heading-two":
      return (
        <h2 style={style} {...attributes}>
          {children || ""}
        </h2>
      );
    case "list-item":
      return (
        <li style={style} {...attributes}>
          {children || ""}
        </li>
      );
    case "numbered-list":
      return (
        <ol style={style} {...attributes}>
          {children || ""}
        </ol>
      );
    case "link":
      return (
        <Link attributes={attributes} element={element} children={children || ""} />
      );
    default:
      return (
        <p style={style} {...attributes}>
          {children || ""}
        </p>
      );
  }
};

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  if (leaf.superscript) {
    children = <sup>{children}</sup>;
  }

  if (leaf.subscript) {
    children = <sub>{children}</sub>;
  }

  if (leaf.strikethrough) {
    children = <s>{children}</s>;
  }

  return (
    <span
      {...attributes}
      style={{
        background: leaf?.bgColor ? leaf?.bgColor : "inherite",
        color: leaf?.color ? leaf?.color : "inherite"
      }}
    >
      {children}
    </span>
  );
};

const withLinks = (editor) => {
  const { isInline } = editor;
  editor.isInline = (element) =>
    element.type === "link" ? true : isInline(element);
  return editor;
};

const TextEditor = ({ value, setValue, readonly, maxContentHeight }) => {
  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

  const editor = useMemo(() => withLinks(withReact(createEditor())), []);

  return (
    <div className="text-editor">
      <Slate
        editor={editor}
        initialValue={value}
        value={value}
        onChange={setValue}
        maxLength={500}
        minLength={1}>
        {!readonly && (
          <Toolbar editor={editor} />
        )}
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder="Enter the note text..."
          className="content"
          style={{
            maxHeight: maxContentHeight ? maxContentHeight : '100%'
          }}
          spellCheck
          readOnly={readonly}
          autoFocus
          onKeyDown={(event) => {
            for (const hotkey in HOTKEYS) {
              if (isHotkey(hotkey, event)) {
                event.preventDefault();
                const mark = HOTKEYS[hotkey];
                toggleMark(editor, mark);
              }
            }
          }}
        />
      </Slate>
    </div>
  );
};

export default TextEditor;
