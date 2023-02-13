import React from "react";
import { useSelector } from "react-redux";

import { TbPlayerPlay, TbPlayerPause, TbPlayerSkipForward } from "react-icons/tb";
import { MdRestartAlt } from "react-icons/md";

/* some attachments for redux action */
import { PERIOD } from "../../../actions/timer";

import { formatTime } from "../../../utils/helper";

const DigitalTimer = ({ time, toggleStart, handleReset, handleSkip }) => {
  const {
    active,
    activites,
    setting,
    started,
  } = useSelector((state) => state.timer);
  const activePeriod = setting.time[active];

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
        {(!started && time === activePeriod) && (
          <button aria-label="reset-button" className="reset-digital" id="reset-digital"
            onClick={handleSkip}
          >
            <TbPlayerSkipForward />
          </button>
        )}
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
