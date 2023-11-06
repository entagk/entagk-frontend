import React from "react";

import { TbPlayerPause } from "react-icons/tb";
import Button from "../../../../../utils/Components/Button/Button";

const Pause = ({ handleClick }) => {
  return (
    <Button
      aria-label="stop on roll"
      className="pause-side"
      id="pause-side"
      onClick={handleClick}
      variant="none"
    >
      <TbPlayerPause />
    </Button>
  )
}

export default Pause;
