import React from "react";

import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';

const TimerControllers = ({ onClick, period, setPeriod }) => {

    const onscroll = () => {
        setPeriod((pPeriod) => pPeriod + 30);
        console.log(period + 30);
    }

    return (
        <>
            <div
                className="different-color"
                style={{
                    backgroundImage: `linear-gradient(${period <= 6 ? 270 : (period - 6) * 30 + 90}deg, transparent 50%, ${period <= 6 ? "white" : "#00f1ee"} 50%), linear-gradient(${(period > 0 && period <= 6) ? period * 30 + 90 : period > 6 ? "270" : "90"}deg, transparent 50%, white 50%)`
                }}
            ></div>
            <div className="roller-container" style={{ backgroundImage: `linear-gradient(${period <= 6 ? 270 : (period - 6) * 30 + 90}deg, transparent 50%, ${period <= 6 ? "white" : "#00f1ee"} 50%), linear-gradient(${(period > 0 && period <= 6) ? period * 30 + 90 : period > 6 ? "270" : "90"}deg, #00f1ee 50%, white 50%)` }}>
                <div className="roll" onScroll={onscroll}>
                    <button aria-label="left-side on roll" className="left-side" id="left" onClick={() => onClick("left")}><AiOutlineMinus /></button>
                    <button aria-label="right-side on roll" className="right-side" id="right" onClick={() => onClick("right")}><AiOutlinePlus /></button>
                </div>
            </div>
        </>
    )
}

export default TimerControllers;