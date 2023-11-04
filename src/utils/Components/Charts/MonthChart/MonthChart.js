import React, { useMemo } from 'react';
import * as d3 from 'd3';
import { formatTime } from '../../../helper';

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

const Day = ({ dayNum, monthData, date, setDateType, setDate }) => {
  const day = new Date(new Date(date?.startDate).setDate(dayNum)).toJSON()?.split('T')[0];

  const dayData = monthData?.find(d => d.day === day);

  const background = d3.scaleSequential(["#ebedf082", '#66bd63', '#1a9850', "#006837"]);

  const formatDate = d3.utcFormat("%B %-d, %Y");

  return (
    <td
      className={
        `${dayNum > 0 ? "num" : ""} ${day === new Date().toJSON().split('T')[0] ? 'active' : ''}`
      }
      style={{
        background: background(dayData?.totalMins / 60),
        color: dayData?.totalMins >= 40 ? "#fff" : "inhrite",
      }}
      title={`${formatDate(new Date(day))}\n${formatTime(dayData?.totalMins)} (HH:MM)`}
      onClick={() => {
        setDateType("day");
        setDate({
          startDate: day,
          endDate: day,
          display: day === new Date().toJSON().split('T')[0] ? 'today' : day
        })
      }}
    >
      {dayNum > 0 ? dayNum : ""}
    </td>
  )
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
                    <>
                      <Day
                        key={index}
                        date={date}
                        dayNum={day}
                        monthData={data}
                        setDateType={setDateType}
                        setDate={setDate}
                      />
                    </>
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
