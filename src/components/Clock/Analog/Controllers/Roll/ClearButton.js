import React from "react";
import { MdRestartAlt } from "react-icons/md";

const PausedRoll = ({ setStarted, setStoped, setPeriod, savedPeriod }) => {

  const handleClear = () => {
    setStarted(false);
    setStoped(-1);
    setPeriod(savedPeriod);
    console.log("timer cleared.");
  }

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

export default PausedRoll;