import React, { lazy, Suspense, useState } from "react";
import { useSelector } from "react-redux";

const TimerControllers = lazy(() => import("../Analog/Controllers/TimerControllers"));
const Arrows = lazy(() => import("../Analog/Arrows"));

const AnalogTimer = () => {
  // const [activePeriod, setActivePeriod] = useState();  
  const { active, activites } = useSelector((state) => state.timer);
  const activePeriod = activites[active].time * 60;
  const [time, setTime] = useState(activePeriod);
  const nums = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
  const increamentVal = 1;

  const onClick = (type) => {
    if (type === "right") {
      if (time < 60) {
        if (time + increamentVal > 60) {
          setTime(pp => (pp + increamentVal) - (time + increamentVal) % 60);
        } else {
          setTime(pp => pp + increamentVal);
        }
      }
    } else {
      if (time >= increamentVal) {
        setTime(pp => pp - increamentVal);
      }
    }
  }

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Arrows
          nums={nums}
          onClick={onClick}
          time={time / 60}
        />
        <TimerControllers
          onClick={onClick}
          setTime={setTime}
          time={time}
        />
      </Suspense>
    </>
  )
};

export default AnalogTimer;