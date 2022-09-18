import React, { lazy, Suspense } from "react";
import { useSelector } from "react-redux";
import AnalogTimer from "./Analog/Analog";

const DigitalTimer = lazy(() => import("./Digital/Digital"));

const Timer = () => {
    const { type } = useSelector((state) => state.timer);

    return (
        <div className="clock-container">
            <div className="clock">
                <Suspense fallback={<div>Loading....</div>}>
                    {type === "digital" ? (<DigitalTimer />) : (
                        <AnalogTimer />
                    )}
                </Suspense>
            </div>
        </div>
    )
}

export default Timer;