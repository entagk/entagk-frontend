import React from "react";

const Loading = ({ color, backgroud, width, height, strokeWidth, containerHeight }) => {
  return (
    <div style={{ position: "relative" }}>
      <div
        className="loading"
        style={{
          top: "0",
          marginBlock: "auto",
          paddingBlock: "20px",
          display: "flex",
          position: "absolute",
          width: "90%",
          alignItems: "center",
          justifyContent: "center",
          backgroud: backgroud,
          height: containerHeight
        }}
      >
        <div className="circle-container">
          <div className="circle" style={{ width: `${width}px`, height: `${height}px` }} /* 200, 200 */>
            <svg viewBox="25 25 50 50" /* 25 25 50 50 */>
              <circle
                cx="50"  /* 50 */
                cy="50" /* 50 */
                r="20" /* 20 */
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth} /* 2.5 */
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
};

export default Loading;