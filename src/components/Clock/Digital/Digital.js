import React, { useCallback, useEffect, useRef, useState } from "react";

import { formatTime } from "../../../Utils/helper";

const DigitalTimer = ({ activePeriod }) => {
  const timeId = useRef(null);
  const realTime = activePeriod * 60;
  const [time, setTime] = useState(realTime);
  const [started, setStarted] = useState(false);

  const clear = () => {
    clearInterval(timeId.current);
    timeId.current = null;
  }

  const count = useCallback(() => {
    if (time > 0) {
      setTime(time - 1);
    }

    if (time <= 1) {
      setStarted(false);
      clear();
    }
    // eslint-disable-next-line
  }, [time]);

  useEffect(() => {
    if (started) {
      timeId.current = setInterval(count, 1000);
    } else {
      clear();
    }

    return clear;
  }, [count, started]);

  const toggleStart = useCallback(() => {
    setStarted(s => !s);
  }, []);


  return (
    <div>
      <h1 style={{ fontSize: 100 }}>{formatTime(time)}</h1>
      <button onClick={toggleStart}>{started ? "Pause" : "start"}</button>
    </div>
  )
}

export default DigitalTimer;