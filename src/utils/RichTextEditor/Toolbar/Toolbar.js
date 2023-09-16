import { useEffect, useState, useRef } from "react";
import { useSlate } from "slate-react";

import LinkButton from "./LinkButton";
import ColorPicker from "./ColorPicker/ColorPicker";

import { Menu, Button } from "../utils/components";
import BlockTypeButton from "./BlockTypeButton";
import iconList from "../utils/icons";

import {
  isMarkActive,
  toggleMark
} from "../utils";
import AlignButton from "./AlignButton";

const Toolbar = ({ editor }) => {
  const toolbarRef = useRef(null);
  const popupRef = useRef(null);
  const [openPopup, setOpenPopup] = useState('');
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
  ];

  // to handle the overflow of editor while opening 
  useEffect(() => {
    if (openPopup) {
      const toolbar = toolbarRef.current;
      const toolbarRect = toolbar.getBoundingClientRect();
      const popup = popupRef.current;
      const popupParantRect = popup.parentElement.getBoundingClientRect();
      const popupRect = popup.getBoundingClientRect();

      if (popupParantRect.left + popupRect.right > toolbarRect.right) {
        popup.style.transform = `translate(-${popupParantRect.left + popupRect.width - toolbarRect.right}px, 0)`;
      }
    }

    // eslint-disable-next-line 
  }, [openPopup]);

  return (
    <Menu ref={toolbarRef}>
      <BlockTypeButton editor={editor} setOpenPopup={setOpenPopup} popupRef={popupRef} />
      {buttons.map((b, index) => {
        switch (b.type) {
          case "mark":
            return <MarkButton key={index} format={b.format} icon={b.format} />;
          case "color":
            return (
              <ColorPicker key={index} format={b.format} editor={editor} setOpenPopup={setOpenPopup} popupRef={popupRef} />
            );
          case "link":
            return <LinkButton key={index} editor={editor} setOpenPopup={setOpenPopup} popupRef={popupRef} />;
          default:
            return <></>;
        }
      })}
      <AlignButton editor={editor} setOpenPopup={setOpenPopup} popupRef={popupRef} />
    </Menu>
  );
};

export default Toolbar;
