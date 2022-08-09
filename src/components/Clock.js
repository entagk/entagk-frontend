import React from "react";

const Clock = () => {
    const nums = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
    const arrows = [1, 2, 3, 4, 5].concat(...Array.from({ length: 11 }, () => [1, 2, 3, 4, 5].map(num => num * 2)));

    return (
        <div className="clock-container">
            <div className="clock">
                {nums.map((item, index) => (
                    <div style={{ "--i": `${index}` }} className="number" key={item}>
                        <p>
                            {item}
                        </p>
                    </div>
                ))}
            </div>
            <div>
                {arrows.map((item, index) => (
                    <span key={index} className={`arrow${index % 5 === 0 ? " main" : ""}`}></span>
                ))}
            </div>
        </div>
    )
}

export default Clock;