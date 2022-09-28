import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { TbPlayerPlay, TbPlayerPause } from "react-icons/tb";
import { MdRestartAlt } from "react-icons/md";

import { changeActive, PERIOD } from "../../../actions/timer";

import { formatTime, pushNotification } from "../../../utils/helper";

import useAudio from "../../../utils/useAudio";

const worker = new window.Worker('worker.js');

const DigitalTimer = () => {
  const { active, activites, notificationInterval, unit } = useSelector((state) => state.timer);
  const activePeriod = unit === 'sec' ? activites[active].time : activites[active].time * 60;
  const [time, setTime] = useState(activePeriod);
  const [started, setStarted] = useState(false);
  const dispatch = useDispatch();

  const trickingSound = useRef(useAudio({ src: "sounds/clock-ticking-1.mp3", volume: 0.5, loop: true }));
  const alarmSound = useRef(useAudio({ src: "sounds/alarm-clock-01.mp3", volume: 0.5 }));
  const clickSound = useRef(useAudio({ src: "sounds/mixkit-arcade-game-jump-coin-216.wav", volume: 0.7 }));

  useEffect(() => {
    // console.log(active);
    if (unit === 'sec') {
      setTime(activites[active].time)
    } else {
      setTime(activites[active].time * 60)
    }
    // eslint-disable-next-line
  }, [active]);

  useEffect(() => {
    // console.log(active);
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

      alarmSound.current.handlePlay();
      trickingSound.current.handleStop();

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
    clickSound.current.handlePlay();
    alarmSound.current.handleStop();
    if (started) {
      worker.postMessage('stop');
      trickingSound.current.handleStop();
    } else {
      trickingSound.current.handlePlay();
      worker.postMessage({ started: !started, count: time });
    }

    // eslint-disable-next-line
  }, [started, time]);

  const handleReset = () => {
    setTime(activePeriod);
    clickSound.current.handlePlay();
  }

  return (
    <div>
      <h1 id="digital-number" className="digital-number">{formatTime(time)}</h1>
      <div className="digital-controlers">
        <button aria-label="start-pause-button" //"start on roll"
          className="start-digital" id="start-digital" style={{ background: activites[active].color }} disabled={time === 0}
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