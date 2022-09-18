import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { TbPlayerPlay, TbPlayerPause } from "react-icons/tb";
import { MdRestartAlt } from "react-icons/md";

import { changeActive, PERIOD } from "../../../actions/timer";

import { formatTime } from "../../../Utils/helper";
const worker = new window.Worker('worker.js');

const DigitalTimer = () => {
  const { active, activites } = useSelector((state) => state.timer);
  const activePeriod = activites[active].time * 60;
  const [time, setTime] = useState(activePeriod);
  const [started, setStarted] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(active);
    setTime(activites[active].time * 60)
    // eslint-disable-next-line
  }, [active]);


  worker.onmessage = (event) => {
    if (event.data !== 'stop') {
      setTime(event.data);
    } else {
      setStarted(false);
      dispatch(changeActive());
      alert("the timer is ended");
    }
  }

  const toggleStart = useCallback(() => {
    setStarted(s => !s);
    if (started) {
      worker.postMessage('stop');
    } else {
      worker.postMessage({ started: !started, count: time });
    }

  }, [started, time]);

  const handleReset = () => {
    setTime(activePeriod);
  }

  return (
    <div>
      <h1 style={{ fontSize: 100 }} id="digital">{formatTime(time)}</h1>
      <div className="digital-controlers">
        <button aria-label="start-pause-button" //"start on roll"
          className="start-digital" id="start-digital" disabled={time === 0}
          onClick={toggleStart}
        >
          {started ? (
            <TbPlayerPause />
          ) : (
            <TbPlayerPlay />
          )}
        </button>
        {(time !== activePeriod && !started && active === PERIOD) && (
          <button aria-label="reset-button" className="reset-digital" id="reset-digital" onClick={handleReset}>
            <MdRestartAlt />
          </button>
        )}
      </div>
    </div>
  )
}

export default DigitalTimer;