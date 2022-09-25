import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { TbPlayerPlay, TbPlayerPause } from "react-icons/tb";
import { MdRestartAlt } from "react-icons/md";

import { changeActive, PERIOD } from "../../../actions/timer";

import { formatTime, pushNotification } from "../../../Utils/helper";
const worker = new window.Worker('worker.js');

const DigitalTimer = () => {
  const { active, activites, notificationInterval, unit } = useSelector((state) => state.timer);
  const activePeriod = unit === 'sec' ? activites[active].time : activites[active].time * 60;
  const [time, setTime] = useState(activePeriod);
  const [started, setStarted] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(active);
    if (unit === 'sec') {
      setTime(activites[active].time)
    } else {
      setTime(activites[active].time * 60)
    }
    // eslint-disable-next-line
  }, [active]);

  useEffect(() => {
    console.log(active);
    document.body.style.backgroundColor = activites[active].color;
    // eslint-disable-next-line
  }, [active]);

  worker.onmessage = (event) => {
    if (event.data !== 'stop') {
      setTime(event.data);
      if (Notification.permission === 'granted') {
        if (time !== 0) {
          if (time % notificationInterval === 0 && time !== activePeriod) {
            pushNotification(`${time / notificationInterval} minutes left!`);
          }
        }
      }
    } else {
      setStarted(false);

      if (Notification.permission === 'granted') {
        if (active === PERIOD) {
          pushNotification("It's time to take a break");
        } else {
          pushNotification("It's time to focus!");
        }
      }

      dispatch(changeActive());
    }
  }

  const toggleStart = useCallback(() => {
    setStarted(s => !s);
    if (started) {
      worker.postMessage('stop');
    } else {
      worker.postMessage({ started: !started, count: time });
      if (Notification.permission === 'granted') {
        if (time === 0) {
          if (active === PERIOD) {
            pushNotification("It's time to take a break");
          } else {
            pushNotification("It's time to focus!");
          }
        } else {
          if (time % notificationInterval === 0) {
            pushNotification(``)
          }
        }
      }
    }

    // eslint-disable-next-line
  }, [started, time]);

  const handleReset = () => {
    setTime(activePeriod);
  }

  return (
    <div>
      <h1 id="digital-number" className="digital-number">{formatTime(time)}</h1>
      <div className="digital-controlers">
        <button aria-label="start-pause-button" //"start on roll"
          className="start-digital" id="start-digital" style={{background: activites[active].color}} disabled={time === 0}
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