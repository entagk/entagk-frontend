import React from "react";

import { TbPlayerPause } from "react-icons/tb";

const Pause = ({ handleClick }) => {
  return (
    <button aria-label="stop on roll"
      className="pause-side" id="pause-side"
      onClick={handleClick}
    >
      <TbPlayerPause />
    </button>
  )
}

export default Pause;