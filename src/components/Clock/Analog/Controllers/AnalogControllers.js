import React, { lazy } from "react";
import { 
  // useDispatch, 
  useSelector 
} from "react-redux";
/* some attachments for redux action */
import { 
  // changeActive, 
  PERIOD, 
  // START_TIMER, 
  // STOP_TIMER 
} from "../../../../actions/timer";
/** 
 * pushNotification ===>> for make push notifications
 */
// import { pushNotification } from "../../../../Utils/helper";
/**
 * useAudio ===> for make 'audio' HTMLElement
 */
// import audioPlayer from "../../../../Utils/audioPlayer";

const StartButton = lazy(() => import("./Roll/StartRoll"));
const ClearButton = lazy(() => import("./Roll/ClearButton"));
const PauseButton = lazy(() => import("./Roll/PauseButton"));
/**
 * worker ===> for make the timer work in the 
 */
// const worker = new window.Worker('worker.js');

const AnalogControllers = ({ time, toggleStart, handleReset }) => {
  const { 
    active, 
    activites, 
    setting, 
    started, 
    // periodNum 
  } = useSelector((state) => state.timer);
  const activePeriod = setting.time[active];
  // const dispatch = useDispatch();

  // /** All sounds that we use it in timer. */
  // const tickingSound = useRef(setting.tickingType.name !== "none" ? audioPlayer({ src: setting.tickingType.src, volume: setting.tickingVolume / 100, loop: true }) : null);
  // const alarmSound = useRef(audioPlayer({ src: setting.alarmType.src, volume: setting.alarmVolume / 100 }));
  // const clickSound = useRef(setting.clickType.name !== "none" ? audioPlayer({ src: setting.clickType.src, volume: setting.clickVolume / 100 }) : null);

 

 

  return (
    <>
      <div
        className="different-color"
        style={{
          backgroundImage: `
                    linear-gradient(
                        ${time / 60 <= 30 ? 270 : (time / 60 - 30) * 6 + 90}deg, 
                        transparent 50%, 
                        ${time / 60 <= 30 ? "white" : activites[active].color} 50%), 
                    linear-gradient(
                        ${(time / 60 > 0 && time / 60 <= 30) ? (time / 60) * 6 + 90 : (time / 60) > 30 ? "270" : "90"}deg, 
                        transparent 50%, 
                        white 50%)
                    `,
          backgroundColor: activites[active].color
        }}
      ></div>
      <div
        className="roller-container"
        style={{
          backgroundImage: `
                    linear-gradient(
                        ${time / 60 <= 30 ? 270 : (time / 60 - 30) * 6 + 90}deg, 
                        transparent 50%, 
                        ${time / 60 <= 30 ? "white" : activites[active].color} 50%
                    ), 
                    linear-gradient(
                        ${(time / 60 > 0 && time / 60 <= 30) ? (time / 60) * 6 + 90 : time / 60 > 30 ? "270" : "90"}deg, 
                        ${activites[active].color} 50%, 
                        white 50%
                    )`
        }}
      >
        <div className="roll" style={{ flexDirection: "column" }}>
          <>
            {started ? (
              <>
                <PauseButton
                  handleClick={toggleStart}
                />
              </>
            ) : (
              <>
                {!started && time !== activePeriod && active === PERIOD ? (
                  <>
                    <StartButton
                      handleClick={toggleStart}
                      time={time}
                      ariaLabel={"continue button on roll"}
                      className={"up-side"}
                      id={"up-side"}
                    />
                    <ClearButton
                      handleClear={handleReset}
                    />
                  </>
                ) : (
                  <>
                    <StartButton
                      handleClick={toggleStart}
                      time={time}
                      ariaLabel={"start on roll"}
                      className={"start-side"}
                      id={"start-side"}
                    />
                  </>
                )}
              </>
            )}
          </>
        </div>
      </div>
    </>
  )
}

export default AnalogControllers;