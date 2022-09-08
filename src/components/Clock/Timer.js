import React, { lazy, Suspense, useState } from "react";
const TimerControllers = lazy(() => import("./Controllers/TimerControllers"));
const Arrows = lazy(() => import("./Arrows"));

const Timer = () => {
    const [period, setPeriod] = useState(15);
    const savedPeriod = period;
    const nums = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
    const increamentVal = 1;

    const onClick = (type) => {
        if (type === "right") {
            if (period < 60) {
                if (period + increamentVal > 60) {
                    setPeriod(pp => (pp + increamentVal) - (period + increamentVal) % 60);
                } else {
                    setPeriod(pp => pp + increamentVal);
                }
            }
        } else {
            if (period >= increamentVal) {
                setPeriod(pp => pp - increamentVal);
            }
        }
    }

    return (
        <div className="clock-container">
            <div className="clock">
                <Suspense fallback={<div>Loading....</div>}>
                    <Arrows nums={nums} onClick={onClick} period={period} />
                    <TimerControllers onClick={onClick} period={period} setPeriod={setPeriod} savedPeriod={savedPeriod} />
                </Suspense>
            </div>
        </div>
    )
}

export default Timer;