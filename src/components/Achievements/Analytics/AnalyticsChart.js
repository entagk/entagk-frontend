import React, { lazy, useEffect, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux';

import { getDay, getDays, getYear } from '../../../actions/activities';
import { calcDays, newDate } from '../../../utils/helper';

const Charts = lazy(() => import('./Charts'));
const DateAndData = lazy(() => import('./DateAndData'));

const AnalyticsChart = ({
  dataType,
  setDataType,
  dateType,
  setDateType,
  setMessage,
  date,
  setDate,
  chart
}) => {
  const dispatch = useDispatch();
  const { days, isLoading, today } = useSelector(state => state.activities);

  const [data, setData] = useState([]);

  useEffect(() => {
    if (dateType === 'day') {
      const day =
        date.display === 'today' ?
          today :
          days.filter(d => d.day === date.startDate)[0];

      if (!day?.day) {
        if (date.display === 'today' && !today) {
          const todayDate = newDate();
          dispatch(getDay(
            todayDate,
            dateType,
            dataType,
            today,
            setData,
            setMessage
          ))
        } else {
          if (days.filter(d => d.day === date.startDate).length === 0) {
            dispatch(getDay(
              date.startDate,
              dateType,
              dataType,
              today,
              setData,
              setMessage
            ))
          }
        }
      } else {
        const max = day?.[dataType]?.reduce((p, c) => p + c?.totalMins, 0);

        if (max !== day?.totalMins) {
          setData([
            ...day?.[dataType],
            {
              name: dataType === 'tasks' ?
                'unknown task' :
                dataType === 'templates' ?
                  'unknown templates' :
                  'unknown types',
              totalMins: day.totalMins - max
            }
          ])
        } else {
          if (day?.[dataType])
            setData(day?.[dataType]);
          else setData([]);
        }
      }
    } else if (dateType === 'week') {
      const todayDate = new Date(today?.day);
      const daysData = days.filter((d) => {
        if (new Date(d.day) - new Date(date.startDate) === 0 || new Date(d.day) - new Date(date.endDate) === 0) {
          return true;
        } else if (new Date(date.startDate) - new Date(d.day) < 0 && new Date(date.endDate) - new Date(d.day) > 0) {
          return true;
        } else return false;
      });

      if (new Date(date.endDate) - todayDate > 0) {
        const neededDays = calcDays(
          newDate(
            todayDate, "+", 1
          ),
          date.endDate
        ).map((d) => ({ day: d }));
        daysData.push(...neededDays);
      }

      if (daysData.length < 7) {
        const sortedDays = daysData.sort((a, b) => a?.day?.localeCompare(b?.day));
        // if the week is start with today
        if (new Date(date.startDate) - todayDate <= 0) {
          const start =
            (sortedDays.length === 0 || (sortedDays.at(-1).day === date.endDate)) ?
              date.startDate :
              newDate(sortedDays.at(-1).day, '+', 1);

          const end =
            sortedDays.length === 0 ?
              date.endDate :
              sortedDays.at(-1).day === date.endDate ?
                newDate(sortedDays[0].day, '-', 1) :
                newDate(sortedDays.at(-1).day, '-', 1);

          dispatch(
            getDays(
              start,
              end,
              daysData,
              setData,
              setMessage
            )
          );
        } else {
          const neededDays = calcDays(
            newDate(
              todayDate, "+", 1
            ),
            date.endDate
          ).map((d) => ({ day: d }));
          const all = daysData.concat(neededDays).sort((a, b) => a?.day?.localeCompare(b?.day));

          setData(all);
        }
      } else {
        setData(daysData)
      }
    } else if (dateType === 'month') {
      console.log(date);
      const todayDate = new Date(today?.day);
      const daysData = days.filter((d) => {
        if (new Date(d.day) - new Date(date.startDate) === 0 || new Date(d.day) - new Date(date.endDate) === 0) {
          return true;
        } else if (new Date(date.startDate) - new Date(d.day) < 0 && new Date(date.endDate) - new Date(d.day) > 0) {
          return true;
        } else return false;
      });

      if (new Date(date.endDate) - todayDate > 0) {
        const neededDays = calcDays(
          newDate(
            todayDate, "+", 1
          ),
          date.endDate
        ).map((d) => ({ day: d }));
        daysData.push(...neededDays);
      }

      // 2023-08-31
      if (daysData.length < Number(date.endDate.slice(8))) {
        const sortedDays = daysData.sort((a, b) => a?.day?.localeCompare(b?.day));

        // if the month is start with today
        if (new Date(date.startDate) - todayDate <= 0) {
          const start =
            (sortedDays.length === 0 || (sortedDays.at(-1).day === date.endDate)) ?
              date.startDate :
              newDate(sortedDays.at(-1).day, '+', 1);

          const end =
            sortedDays.length === 0 ?
              date.endDate :
              sortedDays.at(-1).day === date.endDate ?
                newDate(sortedDays[0].day, '-', 1) :
                newDate(sortedDays.at(-1).day, '-', 1);

          dispatch(
            getDays(
              start,
              end,
              daysData,
              setData,
              setMessage
            )
          );
        } else {
          const neededDays = calcDays(
            newDate(
              todayDate, "+", 1
            ),
            date.endDate
          ).map((d) => ({ day: d }));
          const all = daysData.concat(neededDays).sort((a, b) => a?.day?.localeCompare(b?.day));

          setData(all);
        }
      } else {
        setData(daysData)
      }
    } else {
      dispatch(getYear(date.display, setData, setMessage))
    }
    // eslint-disable-next-line
  }, [dateType, date, dataType]);

  return (
    <>
      <DateAndData
        dataType={dataType}
        setDataType={setDataType}
        dateType={dateType}
        setDateType={setDateType}
        date={date}
        setDate={setDate}
      />
      <Charts
        data={data}
        isLoading={isLoading}
        dataType={dataType}
        dateType={dateType}
        chart={chart}
        date={date}
        setDate={setDate}
        setDateType={setDateType}
      />
    </>
  )
}

export default AnalyticsChart
