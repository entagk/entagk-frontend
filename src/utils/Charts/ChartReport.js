import React from 'react'
import { formatTime, stringToColor } from '../helper'

const ChartReport = ({ rows, totalTime }) => {
  return (
    <div className='chart-report'>
      <div className='rows'>
        <div className='row head-row'>
          <p className="name">Total time</p>
          <p className='rate'>{formatTime(totalTime.toFixed(2))} (HH:MM)</p>
        </div>
        {rows.map((row, index) => (
          <div className='row' key={index}>
            <div>
              <span
                className='row-color'
                style={{
                  background: stringToColor(row.name)
                }}></span>
              <p className="name">{row.name}</p>
            </div>
            <p className='rate'>{formatTime(row?.totalMins?.toFixed(2))}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ChartReport
