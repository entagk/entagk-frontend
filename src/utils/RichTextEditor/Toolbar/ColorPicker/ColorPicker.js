import React, { useRef, useState, useEffect } from "react";
import { MdFormatColorText, MdFormatColorFill, MdCheck } from "react-icons/md";

import { addMarkData } from "../../utils";
import colors from "../../utils/colors";
import { Transforms } from "slate";
import usePopup from "../../utils/usePopup";
import { ReactEditor } from "slate-react";

import "./style.css";

const logo = {
  color: <MdFormatColorText />,
  bgColor: <MdFormatColorFill />
};

const ColorPicker = ({ format, editor, setOpenPopup }) => {
  const [selection, setSelection] = useState();
  const [hexValue, setHexValue] = useState("");
  const [validHex, setValidHex] = useState();
  const colorPickerRef = useRef(null);
  const [showOptions, setShowOptions] = usePopup(colorPickerRef);

  const isValideHexSix = new RegExp("^#[0-9A-Za-z]{6}");
  const isValideHexThree = new RegExp("^#[0-9A-Za-z]{3}");

  const changeColor = (e) => {
    const clickedColor = e.target.getAttribute("data-value");
    selection && Transforms.select(editor, selection);
    selection && ReactEditor.focus(editor);

    addMarkData(editor, { format, value: clickedColor });
    setShowOptions(false);
  };

  const toggleOption = () => {
    setOpenPopup((o) => !o)
    setSelection(editor.selection);
    selection && ReactEditor.focus(editor);

    setShowOptions((prev) => !prev);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!validHex) return;
    selection && Transforms.select(editor, selection);

    addMarkData(editor, { format, value: hexValue });
    setShowOptions(false);
    setValidHex("");
    setHexValue("");
    selection && ReactEditor.focus(editor);
  };

  const handleHexChange = (e) => {
    e.preventDefault();
    const newHex = e.target.value;
    setValidHex(isValideHexSix.test(newHex) || isValideHexThree.test(newHex));
    setHexValue(newHex);
  };

  return (
    <div className="color-picker popup-wrapper" ref={colorPickerRef}>
      <button
        style={{
          color: "black",
          opacity: "1"
        }}
        onClick={toggleOption}
      >
        <span className="icon">{logo[format]}</span>
      </button>
      {showOptions && (
        <div className="popup">
          <div className="color-options">
            {colors.map((color, index) => {
              return (
                <div
                  key={index}
                  data-value={color}
                  onClick={changeColor}
                  className="option"
                  style={{ background: color }}
                  title={color}
                ></div>
              );
            })}
          </div>
          {format === "bgColor" && (
            <div>
              <button
                data-value="transparent"
                title="transparent"
                type="button"
                onClick={changeColor}
                style={{
                  width: "100%",
                  margin: "5px 0",
                  background: "none",
                  color: "#000000a1"
                }}
              >
                Transparent
              </button>
            </div>
          )}
          <p style={{ textAlign: "center", opacity: "0.7", width: "100%" }}>
            OR
          </p>
          <form onSubmit={handleFormSubmit}>
            <div
              className="hexPreview"
              style={{ background: validHex ? hexValue : "#000000" }}
            ></div>
            <input
              type="text"
              placeholder="#000000"
              value={hexValue}
              onChange={handleHexChange}
              style={{
                border:
                  validHex === false ? "1px solid red" : "1px solid lightgray"
              }}
            />
            <button style={{ color: validHex ? "green" : "" }} type={"submit"}>
              <MdCheck />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
