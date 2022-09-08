import React from "react";

import { TbPlayerPause } from "react-icons/tb";

const Pause = ({setStoped, realPeriod}) => {
  const handlePause = () => {
    setStoped(realPeriod);
  }

  return (
    <button aria-label="stop on roll"
      className="pause-side" id="pause-side"
      onClick={handlePause}
    >
      <TbPlayerPause />
    </button>
  )
}

export default Pause;