import React from "react";

import './style.css'

const Loading = ({ color, backgroud, paddingBlock = 0, size, strokeWidth, className }) => {
  const sizes = {
    verybig: { width: 200, stocke: 4 },
    big: { width: 100, stocke: 5 },
    medium: { width: 50, stocke: 5 },
    small: { width: 30, stocke: 6 }
  };

  return (
    <div
      className={`loading-container ${className}`}
    >
      <div
        className="loading"
        style={{
          paddingBlock: `${paddingBlock}px`,
          backgroud: backgroud,
          fontSize: `${sizes[size]?.width || size}px`,
        }}
      >
        <div className="circle-container">
          <div className="circle" style={{ width: `${sizes[size]?.width || size}px`, height: `${sizes[size]?.width || size}px` }} /* 200, 200 */>
            <svg viewBox='0 0 100 100' /* 25 25 50 50 */>
              <circle
                cx="50"
                cy="50"
                r="42"
                strokeWidth={sizes[size]?.stocke || strokeWidth}
                style={{
                  fill: "transparent",
                  stroke: backgroud || '#edebe9'
                }}
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                strokeWidth={sizes[size]?.stocke || strokeWidth}
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
