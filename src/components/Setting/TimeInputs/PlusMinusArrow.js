import React from 'react';
import { BiUpArrow, BiDownArrow } from 'react-icons/bi';

function PlusMinusArrow({ plus, minus, value, max, min, name }) {
  return (
    <div className='plus-minus-arrows'>
      <button
        aria-label='plus arrow'
        className='plus-arrow'
        type="button"
        onClick={(e) => plus(name)}
        disabled={value > max}
      >
        <BiUpArrow />
      </button>
      <button
        aria-label='minus arrow'
        className='minus-arrow'
        type="button"
        onClick={() => minus(name)}
        disabled={value === min}
      >
        <BiDownArrow />
      </button>
    </div>
  );
}

export default PlusMinusArrow;
