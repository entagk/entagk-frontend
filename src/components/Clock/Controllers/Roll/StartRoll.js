import React from "react";
import { TbPlayerPlay } from "react-icons/tb";

const StartButton = ({ setStarted, setStoped, type, period, ariaLabel, className, id }) => {
  const handleStart = () => {
    if (type === "start") {
      setStarted(true);
    } else {
      setStoped(-1);
    }
  }
  return (
    <button aria-label={ariaLabel} //"start on roll"
      className={className} id={id} disabled={period === 0}
      onClick={handleStart}
    >
      <TbPlayerPlay />
    </button>
  )
}

export default StartButton;