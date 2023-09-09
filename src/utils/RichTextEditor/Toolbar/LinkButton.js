import { useRef, useState } from "react";
import { Transforms } from "slate";
import { Button } from "../utils/components";
import { isBlockActive } from "../utils";
import usePopup from "../utils/usePopup";

import iconList from "../utils/icons";
import { insertLink } from "../utils/link";

const LinkButton = (props) => {
  const { editor, setOpenPopup, popupRef } = props;
  const linkInputRef = useRef(null);
  const [showInput, setShowInput] = usePopup(linkInputRef);
  const [url, setUrl] = useState("");
  const [showInNewTab, setShowInNewTab] = useState(false);
  const [selection, setSelection] = useState();

  const handleInsertLink = () => {
    Transforms.select(editor, selection);
    insertLink(editor, { url, showInNewTab });
    setUrl("");
    setShowInput((prev) => !prev);
    setShowInNewTab(false);
  };

  const toggleLink = () => {
    setOpenPopup(oP => !oP ? 'link' : "");
    setSelection(editor.selection);
    setShowInput((prev) => !prev);
  };

  const handleInputChange = ({ target }) => {
    if (target.type === "checkbox") {
      setShowInNewTab((prev) => !prev);
    } else {
      setUrl(target.value);
    }
  };

  return (
    <div ref={linkInputRef} className="popup-wrapper">
      <Button
        className={showInput ? "clicked" : ""}
        active={isBlockActive(editor, "link")}
        format={"link"}
        onClick={toggleLink}
      >
        <span className="toolbar-icon">{iconList["link"]}</span>
      </Button>
      {showInput && (
        <div className="popup" ref={popupRef}>
          <div style={{ display: "flex", gap: "4px", margin: "5px 2px" }}>
            <input
              type="text"
              placeholder="https://google.com"
              value={url}
              onChange={handleInputChange}
            />
            <div onClick={handleInsertLink}>
              <span className="toolbar-icon">{iconList["add"]}</span>
            </div>
          </div>
          <label>
            <input
              type="checkbox"
              checked={showInNewTab}
              onChange={handleInputChange}
            />
            <span style={{ fontSize: "0.8em" }}>Open in new tab</span>
          </label>
        </div>
      )}
    </div>
  );
};

export default LinkButton;
