import React, { lazy, Suspense, useState } from "react";
import { useSelector } from "react-redux";

const TimerControllers = lazy(() => import("./Analog/Controllers/TimerControllers"));
const Arrows = lazy(() => import("./Analog/Arrows"));

const DigitalTimer = lazy(() => import("./Digital/Digital"));

const Timer = () => {
    const { active, activites, type } = useSelector((state) => state.timer);
    const [activePeriod, setActivePeriod] = useState(activites[active].time);
    const nums = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
    const increamentVal = 1;

    const onClick = (type) => {
        if (type === "right") {
            if (activePeriod < 60) {
                if (activePeriod + increamentVal > 60) {
                    setActivePeriod(pp => (pp + increamentVal) - (activePeriod + increamentVal) % 60);
                } else {
                    setActivePeriod(pp => pp + increamentVal);
                }
            }
        } else {
            if (activePeriod >= increamentVal) {
                setActivePeriod(pp => pp - increamentVal);
            }
        }
    }

    return (
        <div className="clock-container">
            <div className="clock">
                <Suspense fallback={<div>Loading....</div>}>
                    {type === "digital" ? (<DigitalTimer activePeriod={activePeriod} />) : (
                        <>
                            <Arrows
                                nums={nums}
                                onClick={onClick}
                                period={activePeriod}
                            />
                            <TimerControllers
                                onClick={onClick}
                                activePeriod={activePeriod}
                                setPeriod={setActivePeriod}
                                savedPeriod={activePeriod}
                            />
                        </>
                    )}
                </Suspense>
            </div>
        </div>
    )
}

export default Timer;