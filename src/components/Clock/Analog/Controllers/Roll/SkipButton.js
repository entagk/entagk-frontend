import React from 'react';
import { TbPlayerSkipForward } from "react-icons/tb";
import Button from '../../../../../utils/Components/Button/Button';

function SkipButton({ handleClick, time }) {
  return (
    <Button
      aria-label="clear button on roll"
      className="down-side"
      id="down" disabled={time === 0}
      onClick={handleClick}
      variant='none'
    >
      <TbPlayerSkipForward />
    </Button>
  );
}

export default SkipButton;
