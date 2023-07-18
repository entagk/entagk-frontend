import React, { Suspense, lazy } from "react";
import { useSelector } from "react-redux";

/* some attachments for redux action */
import { PERIOD } from "../../../../actions/timer";
import Loading from "../../../../utils/Loading/Loading";

const StartButton = lazy(() => import("./Roll/StartButton"));
const ClearButton = lazy(() => import("./Roll/ClearButton"));
const PauseButton = lazy(() => import("./Roll/PauseButton"));
const SkipButton = lazy(() => import("./Roll/SkipButton"));

const AnalogControllers = ({ time, toggleStart, handleReset, handleSkip }) => {
  const {
    active,
    activites,
    setting,
    started,
  } = useSelector((state) => state.timer);
  const activePeriod = setting.time[active];

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
        <div className="roll" style={{ flexDirection: "column", overflow: "hidden" }}>
          <Suspense fallback={
            <Loading
              size="big"
              color={activites[active].color}
              backgroud="transparant"
            />
          }>
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
                      className={"up-side"}
                      id={"up-side"}
                    />
                    <SkipButton
                      handleClick={handleSkip}
                      time={time}
                      ariaLabel={"continue button on roll"}
                      className={"down-side"}
                      id={"down-side"}
                    />
                  </>
                )}
              </>
            )}
          </Suspense>
        </div>
      </div>
    </>
  )
}

export default AnalogControllers;
