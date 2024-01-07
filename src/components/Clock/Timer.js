import React, { Suspense, useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux"; // 2

import { changeActive, PERIOD, START_TIMER, STOP_TIMER, CHANGE_ACTIVE } from "../../actions/timer";

import { pushNotification } from "../../utils/helper";
import audioPlayer from "../../utils/audioPlayer";

import Loading from "../../utils/Components/Loading/Loading";

import "./style.css";
import SmallWinBtn from "./SmallWinBtn/SmallWinBtn";
import SettingOpen from "./SettingOpen/SettingOpen";
import FullscreenBtn from "./FullscreenBtn/FullscreenBtn";

import AnalogTimer from "./Analog/Analog";
import DigitalTimer from "./Digital/Digital";
import { addActivity } from "../../actions/activities";

const worker = new window.Worker('worker.js');
const Timer = ({ setIsLoadingTask, setMessage, setOpenSetting }) => {
    const { user } = useSelector(state => state.auth);
    const { active, setting, started, periodNum } = useSelector((state) => state.timer);
    const { activeId } = useSelector(state => state.tasks);
    const [time, setTime] = useState(localStorage.getItem("restOfTime") === null ? 0 : Number(localStorage.getItem("restOfTime")))
    const startTime = useRef();

    const activePeriod = setting?.time[active];
    const dispatch = useDispatch();

    /** All sounds that we use it in timer.*/
    const tickingSound = useRef(
        setting?.tickingType?.name !== "none" ?
            audioPlayer({
                src: setting?.tickingType?.src,
                volume: setting?.tickingVolume,
                loop: true
            }) :
            null
    );

    const alarmSound = useRef(
        audioPlayer({
            src: setting?.alarmType?.src,
            volume: setting?.alarmVolume,
            loop: setting.alarmRepet > 0 ? true : false
        })
    );

    const clickSound = useRef(setting?.clickType?.name !== "none" ?
        audioPlayer({
            src: setting?.clickType?.src,
            volume: setting?.clickVolume
        }) : null
    );

    useEffect(() => {
        // eslint-disable-next-line
        if ("Notification" in window) {
            if (window?.Notification?.permission === 'default') {
                window?.Notification?.requestPermission();
            }
        }
    }, []);

    useEffect(() => {
        if (setting.time !== undefined) {
            if (setting?.time[active] - Number(localStorage.getItem('restOfTime')) > 1) {
                setTime(setting?.time[active] - Number(localStorage.getItem("restOfTime")));
            } else {
                dispatch(changeActive(active, activeId, setIsLoadingTask, setMessage));
                localStorage.setItem('restOfTime', 0);
            }
        }
        // eslint-disable-next-line
    }, [active, setting.time]);

    // For sounds of timer
    useEffect(() => {
        if (setting?.tickingType.name !== 'none') {
            if (tickingSound.current) {
                tickingSound?.current?.chengeVolume(setting?.tickingVolume);
                tickingSound?.current?.changeFile(setting?.tickingType.src);
            } else {
                tickingSound.current = audioPlayer({
                    src: setting?.tickingType?.src,
                    volume: setting?.tickingVolume,
                    loop: true
                })
            }
        }

        alarmSound.current.chengeVolume(setting?.alarmVolume);
        alarmSound.current.changeFile(setting?.alarmType.src);
        alarmSound.current.changeLoop(setting?.alarmRepet);

        if (setting.clickType.name !== 'none') {
            if (clickSound.current) {
                clickSound.current.chengeVolume(setting.clickVolume);
                clickSound.current.changeFile(setting.clickType.src);
            } else {
                clickSound.current = audioPlayer({
                    src: setting?.clickType?.src,
                    volume: setting?.clickVolume,
                    loop: true
                })
            }
        }
    }, [setting]);

    // If the option of auto pomodors or auto breaks is active, wait for 5 seconds and then start the next time.
    useEffect(() => {
        if (((active === PERIOD && setting.autoPomodors) || (active !== PERIOD && setting.autoBreaks)) && periodNum !== 0 && started) {
            setTimeout(() => {
                alarmSound.current.handleStop();
                if (setting.tickingType.name !== "none") {
                    tickingSound.current.handlePlay();
                }
                if (active === PERIOD) {
                    startTime.current = Date.now();
                }
                worker.postMessage({ started: !started, count: setting.time[active] });
                dispatch({ type: START_TIMER, data: 0 });
                console.log(time, 0, "autoBreaks autoPomodors");
            }, 5000);
            console.log(active);
        }
        // eslint-disable-next-line
    }, [active, setting.autoBreaks, setting.autoPomodors]);

    // This hook will be executed after the timer has been started working through makeing the focus mode if it active.
    useEffect(() => {
        if (started) {
            document.body.onbeforeunload = () => {
                return () => {
                    return "Hello, world!"
                }
            }

            if (setting.focusMode) {
                document.body.style.backgroundColor = "rgb(30 30 30)";
                document.body.style.overflow = "hidden";
            }
        } else {
            document.body.onbeforeunload = null;
            if (setting.focusMode) {
                document.body.style.backgroundColor = 'var(--main-color)';
                document.body.style.overflow = "auto";
            }
        }
        // eslint-disable-next-line
    }, [started]);

    worker.onmessage = (event) => {
        if (event.data !== 'stop') {
            setTime(event.data);
            // eslint-disable-next-line
            if ("Notification" in window) {
                if (window?.Notification?.permission === 'granted') {
                    if (time !== 0) {
                        if (setting.notificationType === 'every') {
                            if (time % (setting.notificationInterval * 60) === 0 && time !== activePeriod) {
                                pushNotification(`${time / 60} minutes left!`);
                            }
                        } else {
                            if (time - (setting.notificationInterval * 60) === 0 && time !== activePeriod) {
                                pushNotification(`${time / 60} minutes left!`);
                            }
                        }
                    }
                }
            }
        } else {
            console.log(event.data, time, 0, "worker stop");

            if (setting.tickingType.name !== "none") {
                tickingSound?.current?.handleStop();
            }
            alarmSound.current.handlePlay();

            if (((active !== PERIOD && !setting.autoPomodors) || (active === PERIOD && !setting.autoBreaks))) {
                dispatch({ type: STOP_TIMER, data: 0 });
            }

            if (setting.alarmRepet > 0) {
                alarmSound.current.changeLoop(true);
                setTimeout(() => {
                    alarmSound.current.handleStop();
                }, setting.alarmRepet * 1000);
                console.log("alarm repet")
            }

            if (active === PERIOD && user) {
                dispatch(
                    addActivity({
                        activeTask: activeId,
                        time: {
                            start: startTime.current,
                            end: Date.now()
                        }
                    })
                );
                startTime.current = Date.now();
            }

            dispatch(changeActive(active, activeId, setIsLoadingTask, setMessage));

            // eslint-disable-next-line
            if ("Notification" in window) {
                if (window?.Notification.permission === 'granted') {
                    if (active === PERIOD) {
                        pushNotification("It's time to take a break");
                    } else {
                        pushNotification("It's time to focus!");
                    }
                }
            }
        }
    }

    useEffect(() => {
        const handleKeys = (event) => {
            const inputsItems = ['input', 'textarea', 'textbox'];
            const activeElement = document.activeElement.tagName.toLowerCase();
            if (inputsItems.findIndex(item => item === activeElement || item === event.target.role) === -1) {
                if (event.code.toLowerCase() === 'space') {
                    toggleStart();
                }

                if (event.code.toLowerCase() === 'arrowright' && !started) {
                    handleSkip();
                }

                if (event.code.toLowerCase() === 'keyc' && !started) {
                    handleReset();
                }
            }
        };

        window.addEventListener('keydown', handleKeys);

        return () => {
            window.removeEventListener('keydown', handleKeys);
        }
    })

    const toggleStart = useCallback(() => {
        console.log("toggle start")
        if (setting.clickType.name !== "none") {
            clickSound.current.handlePlay();
        }
        alarmSound.current.handleStop();

        if (started) {
            if (active === PERIOD && user) {
                dispatch(
                    addActivity({
                        activeTask: activeId,
                        time: {
                            start: startTime.current,
                            end: Date.now()
                        }
                    })
                )
            }

            worker.postMessage("stop");
            if (setting.tickingType.name !== "none") {
                tickingSound?.current?.handleStop();
            }
            dispatch({ type: STOP_TIMER, data: setting.time[active] - time });
        } else {
            if (active === PERIOD) {
                startTime.current = Date.now();
            }
            if (setting.tickingType.name !== "none") {
                tickingSound?.current?.handlePlay();
            }
            if (!started) {
                worker.postMessage({ started: !started, count: time });
            }
            dispatch({ type: START_TIMER, data: 0 });
        }

        // eslint-disable-next-line
    }, [started, time]);

    const handleReset = () => {
        setTime(activePeriod);
        if (setting.clickType.name !== "none") {
            clickSound.current.handlePlay();
        }
        localStorage.setItem("restOfTime", 0)
    }

    const handleSkip = () => {
        dispatch({ type: CHANGE_ACTIVE });
    }

    return (
        <>
            <div className="clock-container" style={{ background: 'var(--secondary-color)' }}>
                {!started && (
                    <>
                        <SmallWinBtn />
                        <SettingOpen setOpenSetting={setOpenSetting} />
                        <FullscreenBtn />
                    </>
                )}
                <div className="clock">
                    <Suspense fallback={
                        <>
                            <Loading
                                color="var(--main-color)"
                                backgroud="transparent"
                                size="175"
                                strokeWidth={4}
                            />
                        </>
                    }>
                        {setting.format === "digital" ? (
                            <>
                                <DigitalTimer
                                    handleReset={handleReset}
                                    toggleStart={toggleStart}
                                    setTime={setTime}
                                    time={time}
                                    handleSkip={handleSkip}
                                />
                            </>
                        ) : (
                            <>
                                <AnalogTimer
                                    handleReset={handleReset}
                                    toggleStart={toggleStart}
                                    setTime={setTime}
                                    time={time}
                                    handleSkip={handleSkip}
                                />
                            </>
                        )}
                    </Suspense>
                </div>
            </div >
        </>
    )
}

export default Timer;
