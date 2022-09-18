import React from "react";
import { TbPlayerPlay } from "react-icons/tb";

const StartButton = ({ handleClick, ariaLabel, className, time, id }) => {
  return (
    <button aria-label={ariaLabel} //"start on roll"
      className={className} id={id} disabled={time === 0}
      onClick={handleClick}
    >
      <TbPlayerPlay />
    </button>
  )
}

export default StartButton;