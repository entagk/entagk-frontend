import React from "react";

const Arrows = ({ nums, onClick, period }) => {
    const arrows = [1, 2, 3, 4, 5].concat(...Array.from({ length: 5 }, () => [1, 2, 3, 4, 5]));
    let roteNum = 0;

    const generateRotation = () => {
        const rotation = roteNum * 6;
        roteNum++;
        return rotation;
    }

    return (
        <>
            {nums.map((item, index) => (
                <div style={{ "--i": `${index}` }} className={`number number${index}${period === item && " active"}`} id={index} key={item}>
                    <p id={index} onClick={onClick}>
                        {item}
                    </p>
                </div>
            ))}
            <div className="arrows">
                {arrows.map((item, index) => (
                    <span key={index} style={{ "--rotation": generateRotation() }} className={`arrow${index % 5 === 0 ? " main" : ""}`}></span>
                ))}
            </div>
        </>
    )
};

export default Arrows;