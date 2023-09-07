import { useSlate } from "slate-react";

import LinkButton from "./LinkButton";
import ColorPicker from "./ColorPicker/ColorPicker";

import { Menu, Button } from "../utils/components";
import iconList from "../utils/icons";

import {
  TEXT_ALIGN_TYPES,
  isBlockActive,
  toggleBlock,
  isMarkActive,
  toggleMark
} from "../utils";

const Toolbar = ({ editor, setOpenPopup }) => {
  const BlockButton = ({ format, icon }) => {
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
      >
        <span
          style={{ color: active ? "#000" : "inherit" }}
          className="toolbar-icon"
        >
          {iconList[icon]}
        </span>
      </Button>
    );
  };

  const MarkButton = ({ format, icon }) => {
    const editor = useSlate();
    const active = isMarkActive(editor, format);
    return (
      <Button
        active={active}
        onMouseDown={(event) => {
          event.preventDefault();
          toggleMark(editor, format);
        }}
      >
        <span
          className="toolbar-icon"
          style={{ color: active ? "#000" : "inherit" }}
        >
          {iconList[icon]}
        </span>
      </Button>
    );
  };

  const buttons = [
    { format: "bold", type: "mark" },
    { format: "italic", type: "mark" },
    { format: "underline", type: "mark" },
    { format: "strikethrough", type: "mark" },
    { format: "color", type: "color" },
    { format: "bgColor", type: "color" },
    { format: "code", type: "mark" },
    { type: "link" },
    { format: "superscript", type: "mark" },
    { format: "subscript", type: "mark" },
    { format: "heading-one", type: "block" },
    { format: "heading-two", type: "block" },
    { format: "block-quote", type: "block" },
    { format: "left", type: "block" },
    { format: "center", type: "block" },
    { format: "right", type: "block" },
    { format: "justify", type: "block" },
    { format: "numbered-list", type: "block" },
    { format: "bulleted-list", type: "block" }
  ];

  return (
    <Menu>
      {buttons.map((b, index) => {
        switch (b.type) {
          case "mark":
            return <MarkButton key={index} format={b.format} icon={b.format} />;
          case "color":
            return (
              <ColorPicker key={index} format={b.format} editor={editor} setOpenPopup={setOpenPopup} />
            );
          case "block":
            return (
              <BlockButton
                key={index}
                format={b.format}
                icon={
                  TEXT_ALIGN_TYPES.includes(b.format)
                    ? `align-${b.format}`
                    : b.format
                }
              />
            );
          case "link":
            return <LinkButton key={index} editor={editor} setOpenPopup={setOpenPopup} />;
          default:
            return <></>;
        }
      })}
    </Menu>
  );
};

export default Toolbar;
