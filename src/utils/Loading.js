import React from "react";

const Loading = ({ color, backgroud, paddingBlock, size, strokeWidth }) => {
  return (
    <div style={{ position: "relative", margin: 20 }}>
      <div
        className="loading"
        style={{
          marginBlock: "auto",
          paddingBlock: `${paddingBlock}px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroud: backgroud,
          fontSize: `${size}px`,
        }}
      >
        <div className="circle-container">
          <div className="circle" style={{ width: `${size}px`, height: `${size}px` }} /* 200, 200 */>
            <svg viewBox='0 0 100 100' /* 25 25 50 50 */>
              <circle
                cx="50"
                cy="50"
                r="42"
                strokeWidth={strokeWidth}
                style={{
                  fill: "transparent",
                  stroke: backgroud || '#edebe9'
                }}
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                strokeWidth={strokeWidth}
                style={{
                  fill: "transparent",
                  stroke: color
                }}
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
};

export default Loading;
