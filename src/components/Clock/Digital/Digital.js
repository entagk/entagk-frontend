import React/*, { useCallback, useEffect, useRef }*/ from "react"; // 1
import { 
  // useDispatch, 
  useSelector } from "react-redux"; // 2
/** icons */
import { TbPlayerPlay, TbPlayerPause } from "react-icons/tb";
import { MdRestartAlt } from "react-icons/md";
/* some attachments for redux action */
import { 
  // changeActive, 
  PERIOD, 
  // START_TIMER, 
  // STOP_TIMER 
} from "../../../actions/timer";
/** 
 * formatTime ===>> for make the time in this 'mm:ss'
 * pushNotification ===>> for make push notifications
 */
import { 
  formatTime, 
  // pushNotification 
} from "../../../utils/helper";
/**
 * useAudio ===> for make 'audio' HTMLElement
 */
// import audioPlayer from "../../../Utils/audioPlayer";
/**
 * worker ===> for make the timer work in the 
 */
// const worker = new window.Worker('worker.js');

const DigitalTimer = ({ time, toggleStart, handleReset }) => {
  const { 
    active, 
    activites, 
    setting, 
    started, 
    // periodNum 
  } = useSelector((state) => state.timer);
  const activePeriod = setting.time[active];
  // const dispatch = useDispatch();

  /** All sounds that we use it in timer.*/
  // const tickingSound = useRef(setting.tickingType.name !== "none" ? audioPlayer({ src: setting.tickingType.src, volume: setting.tickingVolume / 100, loop: true }) : null);
  // const alarmSound = useRef(audioPlayer({ src: setting.alarmType.src, volume: setting.alarmVolume / 100 }));
  // const clickSound = useRef(setting.clickType.name !== "none" ? audioPlayer({ src: setting.clickType.src, volume: setting.clickVolume / 100 }) : null);

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