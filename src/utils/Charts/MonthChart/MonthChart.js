import React, { useMemo } from 'react'

import './style.css';

const getMonthDaysNum = (day) => {
  const month = new Date(day).getMonth();
  const year = new Date(day).getFullYear();

  return new Date(year, month + 1, 0).getDate();
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

const MonthChart = ({ date, data, setDate, setDateType }) => {
  const dayNames = [
    'Sun', 'Mon',
    'Tue', 'Wed',
    'Thu', 'Fri', 'Sat'
  ];

  const month = useMemo(
    () =>
      getMonth(date.startDate || new Date.toJSON().split('T')[0]),
    [date]
  );

  const generateDayClass = (dayNum) => {
    const day = new Date(new Date(date.startDate).setDate(dayNum)).toJSON()?.split('T')[0];

    const dayData = data?.find(d => d.day === day);
    let className = '';

    if (dayData?.totalMins / 40 >= 1 && dayData?.totalMins / 40 < 4) {
      className = 'small';
    } else if (dayData?.totalMins / 40 >= 4 && dayData?.totalMins / 40 < 9) {
      className = 'medium'
    } else if (dayData?.totalMins / 40 >= 9) {
      className = 'larg'
    }

    return className;
  }

  const newDateByDay = (day) => {
    if (day)
      return new Date(new Date(date?.startDate).setDate(day)).toJSON().split('T')[0];
    else return new Date().toJSON().split('T')[0];
  }

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
                        `${day > 0 ? "num" : ""}  ${newDateByDay(day) === newDateByDay() ? 'active' : ''} ${generateDayClass(day)}`
                      }
                      onClick={() => {
                        setDateType("day");
                        setDate({
                          startDate: newDateByDay(day),
                          endDate: newDateByDay(day),
                          display: newDateByDay(day) === newDateByDay() ? 'today' : newDateByDay(day)
                        })
                      }}
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
