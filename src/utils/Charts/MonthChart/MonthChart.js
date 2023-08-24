import React, { useEffect, useState } from 'react'

import './style.css';

const getMonthDaysNum = (day) => {
  const month = new Date(day).getMonth();
  const year = new Date(day).getFullYear();

  return new Date(year, month, 0).getDate();
}

const getMonth = (day) => {
  const monthDays = new Array(6).fill(new Array(7).fill(0));
  const numberOfDays = getMonthDaysNum(day);
  const start = new Date(new Date(day).setDate(1));

  return monthDays.map((week, iW) => {
    return week.map((_, iD) => {
      if (iW === 0 && iD === start.getDay()) {
        return 1;
      } else if (iW === 0 && iD > start.getDay()) {
        return iD + 1 - start.getDay();
      } else if (iW > 0) {
        const num = ((iW) * 7) + iD - start.getDay() + 1;
        if (num <= numberOfDays)
          return num;
        else return 0;
      } else return 0;
    })
  })
}

const MonthChart = ({ date }) => {
  const [month, setMonth] = useState(getMonth(date?.startDate || new Date().toJSON().split('T')[0]));

  useEffect(() => {
    setMonth(getMonth(date.startDate));
    // eslint-disable-next-line
  }, [date]);

  const dayNames = [
    'Sun', 'Mon',
    'Tue', 'Wed',
    'Thu', 'Fri', 'Sat'
  ];

  return (
    <>
      <table id="calender">
        <thead>
          <tr>
            {dayNames.map((item, index) => (
              <td key={index}>
                {item}
              </td>
            ))}
          </tr>
        </thead>
        <tbody>
          {month?.map((week, i) => (
            <tr key={i}>
              {week ? (
                <>{
                  week?.map((day, index) => (
                    <td
                      key={index}
                      className={
                        `${day > 0 ? "num" : ""}  ${
                          new Date(new Date(date?.startDate).setDate(day+1)).toJSON().split('T')[0] ===
                          new Date().toJSON().split('T')[0] ?
                          'active' :
                          ''
                        }`
                      }
                    >
                      {day > 0 ? day : ""}
                    </td>
                  ))
                }</>
              ) : (<></>)}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default MonthChart;
