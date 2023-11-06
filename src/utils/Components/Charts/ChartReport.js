import React from 'react'
import { formatTime, stringToColor } from '../../helper'

const ChartReport = ({ rows, totalTime = 0 }) => {
  return (
    <div className='chart-report'>
      <div className='rows'>
        <div className='row head-row'>
          <p className="name">Total time</p>
          <p className='rate'>{formatTime(totalTime?.toFixed(2), 'hh:mm:ss')}</p>
        </div>
        {rows.sort((a, b) => b.totalMins - a.totalMins).map((row, index) => (
          <div className='row' key={index}>
            <div>
              <span
                className='row-color'
                style={{
                  background: stringToColor(row.name)
                }}></span>
              <p className="name">{row.name}</p>
            </div>
            <p className='rate'>{formatTime(row?.totalMins, 'hh:mm:ss')}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ChartReport
