import React from "react";
import { TbPlayerPlay } from "react-icons/tb";
import Button from "../../../../../utils/Button/Button";

const StartButton = ({ handleClick, ariaLabel, className, time, id }) => {
  return (
    <Button
      id={id}
      aria-label={ariaLabel} //"start on roll"
      className={className}
      disabled={time === 0}
      onClick={handleClick}
      variant="none"
    >
      <TbPlayerPlay />
    </Button>
  )
}

export default StartButton;
