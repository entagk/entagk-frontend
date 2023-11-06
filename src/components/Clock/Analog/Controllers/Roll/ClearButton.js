import React from "react";
import { MdRestartAlt } from "react-icons/md";
import Button from "../../../../../utils/Components/Button/Button";

const ClearButton = ({ handleClear }) => {
  return (
    <>
      <Button
        aria-label="clear button on roll"
        className="down-side" id="down"
        onClick={handleClear}
        variant="none"
      >
        <MdRestartAlt />
      </Button>
    </>
  )
}

export default ClearButton;
