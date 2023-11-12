import React from 'react'
import { formatTime, stringToColor } from '../../helper'

const ChartReport = ({ rows, dataType, totalTime = 0 }) => {
  console.log("rows: ", rows);
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
                  background: stringToColor(dataType !== 'types' ? row.name : row?.typeData?.name)
                }}></span>
              <span className='type-icon'>{String.fromCodePoint(parseInt(((row.type?.code || row?.typeData?.code) || "1F6AB"), 16))}</span>
              <p className="name">{dataType !== 'types' ? row.name : row?.typeData?.name}</p>
            </div>
            <p className='rate'>{formatTime(row?.totalMins, 'hh:mm:ss')}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ChartReport
