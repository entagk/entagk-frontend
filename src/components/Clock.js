import React from "react";

const Clock = () => {
    const nums = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
    const arrows = [1, 2, 3, 4, 5].concat(...Array.from({ length: 5 }, () => [1, 2, 3, 4, 5]));
    let roteNum = 0;

    const generateRotation = () => {
        const rotation = roteNum * 6;
        roteNum++;
        return rotation;
    }

    return (
        <div className="clock-container">
            <div className="clock">
                {nums.map((item, index1) => (
                    <div style={{ "--i": `${index1}` }} className="number" key={item}>
                        <p>
                            {item}
                        </p>
                    </div>
                ))}
                <div className="arrows">
                    {arrows.map((item, index2) => (
                        <span key={index2} style={{ "--rotation": generateRotation() }} className={`arrow${index2 % 5 === 0 ? " main" : ""}`}></span>
                    ))}
                </div>
                <div className="roller-container">
                    <div className="roll">
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Clock;