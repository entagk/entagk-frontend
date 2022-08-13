import React, {useState} from "react";
import TimerControllers from "./TimerControllers";

const Timer = () => {
    const [period, setPeriod] = useState(0);
    const nums = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
    const arrows = [1, 2, 3, 4, 5].concat(...Array.from({ length: 5 }, () => [1, 2, 3, 4, 5]));
    let roteNum = 0;


    const generateRotation = () => {
        const rotation = roteNum * 6;
        roteNum++;
        return rotation;
    }

    const onClick = (type) => {
        if (type === "right") {
            if (period < 12) {
                setPeriod(pp => pp + 1);
            }
        } else {
            if (period >= 1) {
                setPeriod(pp => pp - 1);
            }
        }
    }

    return (
        <div className="clock-container">
            <div className="clock">
                {nums.map((item, index) => (
                    <div style={{ "--i": `${index}`, color: period === index ? "#e7e7e7" : "#000" }} className={`number number${index}`} id={index} key={item}>
                        <p id={index} onClick={onClick}>
                            {item}
                        </p>
                    </div>
                ))}
                <div className="arrows">
                    {arrows.map((item, index2) => (
                        <span key={index2} style={{ "--rotation": generateRotation() }} className={`arrow${index2 % 5 === 0 ? " main" : ""}`}></span>
                    ))}
                </div>
                <TimerControllers onClick={onClick} period={period} setPeriod={setPeriod} />
            </div>
        </div>
    )
}

export default Timer;