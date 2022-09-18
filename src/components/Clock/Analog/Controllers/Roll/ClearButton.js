import React from "react";
import { MdRestartAlt } from "react-icons/md";

const ClearButton = ({ handleClear }) => {
  return (
    <>
      <button
        aria-label="clear button on roll"
        className="down-side" id="down"
        onClick={handleClear}
      >
        <MdRestartAlt />
      </button>
    </>
  )
}

export default ClearButton;