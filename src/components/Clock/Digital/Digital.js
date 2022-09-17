import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeActive } from "../../../actions/timer";

import { formatTime } from "../../../Utils/helper";
const worker = new window.Worker('worker.js');

const DigitalTimer = () => {
  const { active, activites } = useSelector((state) => state.timer);
  const activePeriod = activites[active].time;
  const [time, setTime] = useState(activePeriod * 60);
  const [started, setStarted] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    // setActivePeriod();
    console.log(active);
    setTime(activites[active].time * 60)
    // eslint-disable-next-line
}, [active]);

  const toggleStart = useCallback(() => {
    setStarted(s => !s);
    if(started) {
      worker.postMessage('stop');
    } else {
      worker.postMessage({started: !started, count: time });
    }
    // eslint-disable-next-line
  }, [started]);
  
  worker.onmessage = (event) => {
    if(event.data !== 'stop') {
      setTime(event.data);
    } else {
      setStarted(false);
      dispatch(changeActive());
    }
  }
  
  return (
    <div>
      <h1 style={{ fontSize: 100 }} id="digital">{formatTime(time)}</h1>
      <button onClick={toggleStart}>{started ? "Pause" : "Start"}</button>
    </div>
  )
}

export default DigitalTimer;