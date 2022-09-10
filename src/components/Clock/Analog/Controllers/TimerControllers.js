import React, { useEffect, useState, lazy, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { finishPeriod } from "../../../../actions/timer";

const StartButton = lazy(() => import("./Roll/StartRoll"));
const Edit = lazy(() => import("./Roll/EditRoll"));
const ClearButton = lazy(() => import("./Roll/ClearButton"));
const PauseButton = lazy(() => import("./Roll/PauseButton"));

const TimerControllers = ({ onClick, activePeriod, setPeriod, savedPeriod }) => {
    const [location, setLocation] = useState('/');
    const [started, setStarted] = useState(false);
    const [stoped, setStoped] = useState(-1);
    const { active, period, long, short } = useSelector(state => state.timer);
    let realPeriod = activePeriod;
    const dispatch = useDispatch();

    // eslint-disable-next-line
    useEffect(() => {
        const winLocation = window.location;
        setLocation(winLocation.pathname);
    });

    useEffect(() => {
        let timeId = null;

        timeId = setInterval(() => {
            if (
                (started && stoped - (1 / 60) !== realPeriod) &&
                realPeriod - (1 / 60) > stoped &&
                realPeriod - (1 / 60) >= 0
            ) {
                setPeriod((p) => p - (1 / 60));
                // eslint-disable-next-line
                realPeriod = realPeriod - (1 / 60);
            } else {
                console.log("stoped");
                if (stoped - (1 / 60) === realPeriod) {
                    setPeriod(realPeriod);
                    alert("stoped");
                } else if (realPeriod - (1 / 60) <= 0) {
                    if (active === 'period') {
                        dispatch(finishPeriod());
                    }
                    setStarted(false);
                    alert("take break now!");
                }
                clearInterval(timeId);
            }
            console.log(started, stoped, savedPeriod, period, realPeriod);
        }, 1000);

        // eslint-disable-next-line
        return () => clearInterval(timeId);
    }, [started, stoped]);

    useEffect(() => {
        if (active === 'period') {
            setPeriod(period);
        } else if (active === "long") {
            setPeriod(long);
        } else {
            setPeriod(short);
        }
        // eslint-disable-next-line
    }, [active]);

    return (
        <>
            <div
                className="different-color"
                style={{
                    backgroundImage: `
                    linear-gradient(
                        ${activePeriod <= 30 ? 270 : (activePeriod - 30) * 6 + 90}deg, 
                        transparent 50%, 
                        ${activePeriod <= 30 ? "white" : "#ff002f"} 50%), 
                    linear-gradient(
                        ${(activePeriod > 0 && activePeriod <= 30) ? activePeriod * 6 + 90 : activePeriod > 30 ? "270" : "90"}deg, 
                        transparent 50%, 
                        white 50%)
                    `
                }}
            ></div>
            <div
                className="roller-container"
                style={{
                    backgroundImage: `
                    linear-gradient(
                        ${activePeriod <= 30 ? 270 : (activePeriod - 30) * 6 + 90}deg, 
                        transparent 50%, 
                        ${activePeriod <= 30 ? "white" : "#ff002f"} 50%
                    ), 
                    linear-gradient(
                        ${(activePeriod > 0 && activePeriod <= 30) ? activePeriod * 6 + 90 : activePeriod > 30 ? "270" : "90"}deg, 
                        #ff002f 50%, 
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
                                    {started && stoped !== -1 && (active === "period") ? (
                                        <>
                                            <Suspense fallback={<div>Loading...</div>}>
                                                <StartButton
                                                    type={"continue"}
                                                    setStarted={setStarted}
                                                    setStoped={setStoped}
                                                    period={activePeriod}
                                                    ariaLabel={"continue button on roll"}
                                                    className={"up-side"}
                                                    id={"up-side"}
                                                />
                                                <ClearButton
                                                    setStarted={setStarted}
                                                    setStoped={setStoped}
                                                    setPeriod={setPeriod}
                                                    savedPeriod={period}
                                                />
                                            </Suspense>
                                        </>
                                    ) : (
                                        <Suspense fallback={<div>Loading...</div>}>
                                            <PauseButton setStoped={setStoped} realPeriod={realPeriod} />
                                        </Suspense>
                                    )}
                                </>
                            ) : (
                                <Suspense fallback={<div>Loading...</div>}>
                                    <StartButton
                                        type={"start"}
                                        setStarted={setStarted}
                                        setStoped={setStoped}
                                        period={activePeriod}
                                        ariaLabel={"start on roll"}
                                        className={"start-side"}
                                        id={"start-side"}
                                    />
                                </Suspense>
                            )}
                        </>
                    ))}
                </div>
            </div>
        </>
    )
}

export default TimerControllers;