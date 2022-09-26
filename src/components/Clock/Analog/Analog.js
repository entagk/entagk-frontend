import React, { lazy, Suspense, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Loading from "../../../Utils/Loading";

const TimerControllers = lazy(() => import("../Analog/Controllers/TimerControllers"));
const Arrows = lazy(() => import("../Analog/Arrows"));

const AnalogTimer = () => {
  const { active, activites, unit } = useSelector((state) => state.timer);
  const activePeriod = unit === 'sec' ? activites[active].time : activites[active].time * 60;
  const [time, setTime] = useState(activePeriod);
  const nums = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
  const increamentVal = 1;

  useEffect(() => {
    console.log(active);
    if(unit === 'sec') {
      setTime(activites[active].time)
    } else {
      setTime(activites[active].time * 60)
    }
    // eslint-disable-next-line
  }, [active]);

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
      <Suspense fallback={<Loading color={activites[active].color} />}>
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