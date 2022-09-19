import React, { useEffect, useState, lazy, Suspense, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeActive, PERIOD } from "../../../../actions/timer";

const StartButton = lazy(() => import("./Roll/StartRoll"));
const Edit = lazy(() => import("./Roll/EditRoll"));
const ClearButton = lazy(() => import("./Roll/ClearButton"));
const PauseButton = lazy(() => import("./Roll/PauseButton"));

const worker = new window.Worker('worker.js');

const TimerControllers = ({ onClick, setTime, time }) => {
    const { active, activites } = useSelector((state) => state.timer);
    const activePeriod = activites[active].time * 60;
    const [started, setStarted] = useState(false);
    const dispatch = useDispatch();
    const [location, setLocation] = useState('/');

    // eslint-disable-next-line
    useEffect(() => {
        const winLocation = window.location;
        setLocation(winLocation.pathname);
    });

    worker.onmessage = (event) => {
        if (event.data !== 'stop') {
            setTime(event.data);
        } else {
            setStarted(false);
            dispatch(changeActive());
            alert("the timer is ended"); // remove it and make it use notification and sounds
        }
    }

    const toggleStart = useCallback(() => {
        setStarted(s => !s);
        if (started) {
            worker.postMessage("stop");
        } else {
            worker.postMessage({ started: !started, count: time });
        }
    }, [started, time]);

    const handleReset = () => {
        setTime(activePeriod);
    }

    useEffect(() => {
        console.log(active);
        setTime(activites[active].time * 60);
        document.body.style.backgroundColor = activites[active].color;
        // document.querySelector(".clock-container").style.backgroundColor = 
        // eslint-disable-next-line
    }, [active]);

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
                <div className="roll" style={{ flexDirection: `${location !== '/edit' && "column"}` }}>
                    {(location === '/edit' ? (
                        <>
                            <Suspense fallback={<div>Loading...</div>}>
                                <Edit onClick={onClick} />
                            </Suspense>
                        </>
                    ) : location === '/' && (
                        <>
                            {started ? (
                                <>
                                    <PauseButton
                                        handleClick={toggleStart}
                                    />
                                    {/* <Suspense fallback={<div>Loading...</div>}>
                                    </Suspense> */}
                                </>
                            ) : (
                                <>
                                    {!started && time !== activePeriod && active === PERIOD ? (
                                        <>
                                            <Suspense fallback={<div>Loading...</div>}>
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
                                            </Suspense>
                                        </>
                                    ) : (
                                        <>
                                            <Suspense fallback={<div>Loading...</div>}>
                                                <StartButton
                                                    handleClick={toggleStart}
                                                    time={time}
                                                    ariaLabel={"start on roll"}
                                                    className={"start-side"}
                                                    id={"start-side"}
                                                />
                                            </Suspense>
                                        </>
                                    )}
                                </>
                            )}
                        </>
                    ))}
                </div>
            </div>
        </>
    )
}

export default TimerControllers;