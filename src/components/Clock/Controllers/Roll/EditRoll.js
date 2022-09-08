import React from 'react';
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";


const Edit = ({ onClick }) => {
  return (
    <>
      <button
        aria-label="Minus the period"
        className="up-side" id="up"
        onClick={() => onClick("left")}
      >
        <AiOutlineMinus />
      </button>
      <button
        aria-label="Plus the period"
        className="down-side" id="down"
        onClick={() => onClick("right")}
      >
        <AiOutlinePlus />
      </button>
    </>
  )
}

export default Edit;