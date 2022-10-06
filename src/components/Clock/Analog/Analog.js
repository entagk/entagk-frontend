import React, { lazy } from "react";

const AnalogControllers = lazy(() => import("../Analog/Controllers/AnalogControllers"));
const Arrows = lazy(() => import("../Analog/Arrows"));

const AnalogTimer = ({ time, setTime, handleReset, toggleStart }) => {
  const nums = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  return (
    <>
      <Arrows
        nums={nums}
        time={time <= 60 ? time : time / 60}
      />
      <AnalogControllers
        handleReset={handleReset} toggleStart={toggleStart} setTime={setTime} time={time}
      />
    </>
  )
};

export default AnalogTimer;