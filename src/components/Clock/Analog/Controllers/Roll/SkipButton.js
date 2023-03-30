import React from 'react';
import { TbPlayerSkipForward } from "react-icons/tb";

function SkipButton({ handleClick, time }) {
  return (
    <button aria-label="clear button on roll"
    className="down-side" id="down" disabled={time === 0}
      onClick={handleClick}
    >
      <TbPlayerSkipForward />
    </button>
  );
}

export default SkipButton;
