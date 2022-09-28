import React, { useEffect, useState, lazy, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeActive, PERIOD } from "../../../../actions/timer";

import { pushNotification } from "../../../../utils/helper";
import useAudio from "../../../../utils/useAudio";

const StartButton = lazy(() => import("./Roll/StartRoll"));
const Edit = lazy(() => import("./Roll/EditRoll"));
const ClearButton = lazy(() => import("./Roll/ClearButton"));
const PauseButton = lazy(() => import("./Roll/PauseButton"));

const worker = new window.Worker('worker.js');

const TimerControllers = ({ onClick, setTime, time }) => {
    const { active, activites, unit, notificationInterval } = useSelector((state) => state.timer);
    const activePeriod = unit === 'sec' ? activites[active].time : activites[active].time * 60;
    const [started, setStarted] = useState(false);
    const dispatch = useDispatch();
    const [location, setLocation] = useState('/');

    const trickingSound = useRef(useAudio({ src: "sounds/clock-ticking-1.mp3", volume: 0.5, loop: true }));
    const alarmSound = useRef(useAudio({ src: "sounds/alarm-clock-01.mp3", volume: 0.5 }));
    const clickSound = useRef(useAudio({ src: "sounds/mixkit-arcade-game-jump-coin-216.wav", volume: 0.7 }));

    // eslint-disable-next-line
    useEffect(() => {
        const winLocation = window.location;
        setLocation(winLocation.pathname);
    });

    useEffect(() => {
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
            dispatch(changeActive(active));
        }
    }

    const toggleStart = useCallback(() => {
        setStarted(s => !s);
        clickSound.current.handlePlay();
        if (started) {
            worker.postMessage("stop");
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
                            <Edit onClick={onClick} />
                        </>
                    ) : location === '/' && (
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
                    ))}
                </div>
            </div>
        </>
    )
}

export default TimerControllers;