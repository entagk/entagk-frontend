import React from "react";
import { useSelector } from "react-redux";

import { TbPlayerPlay, TbPlayerPause, TbPlayerSkipForward } from "react-icons/tb";
import { MdRestartAlt } from "react-icons/md";

/* some attachments for redux action */
import { PERIOD } from "../../../actions/timer";

import { formatTime } from "../../../utils/helper";
import Button from "../../../utils/Button/Button";

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
        <Button
          aria-label="start-pause-button" //"start on roll"
          className="start-digital"
          id="start-digital"
          style={{ background: activites[active].color }}
          disabled={time === 0}
          onClick={toggleStart}
          variant="none"
          startIcon={
            <>
              {started ? (
                <TbPlayerPause />
              ) : (
                <TbPlayerPlay />
              )}
            </>
          }
        />
        {(!started && time === activePeriod) && (
          <Button
            aria-label="reset-button"
            className="reset-digital"
            id="reset-digital"
            onClick={handleSkip}
            variant="none"
            startIcon={
              <TbPlayerSkipForward />
            }
          />
        )}
        {(time !== activePeriod && !started && active === PERIOD) && (
          <Button
            aria-label="reset-button"
            className="reset-digital"
            id="reset-digital"
            onClick={handleReset}
            variant="none"
            startIcon={
              <MdRestartAlt />
            }
          />
        )}
      </div>
    </div>
  )
}

export default DigitalTimer;
