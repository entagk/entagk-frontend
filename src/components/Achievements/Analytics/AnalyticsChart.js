import React, { lazy, useEffect, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux';

import { getDay, getDays } from '../../../actions/activities';
import { calcDays } from '../../../utils/helper';

const Charts = lazy(() => import('./Charts'));
const DateAndData = lazy(() => import('./DateAndData'));

const AnalyticsChart = ({
  dataType,
  setDataType,
  dateType,
  setDateType,
  setMessage,
  date,
  setDate
}) => {
  const dispatch = useDispatch();
  const { days, isLoading, today } = useSelector(state => state.activities);

  const [data, setData] = useState([]);

  const newDate = (date, type = '+', num) => {
    const oldDate = new Date(date);

    return new Date(
      new oldDate.setDate(
        type === '+' ?
        oldDate.getDate() + num :
        oldDate.getDate() - num
      )
    ).toJSON().split('T')[0]
  }

  useEffect(() => {
    if (dateType === 'day') {
      const day =
        date.display === 'today' ?
          today :
          days.filter(d => d.day === date.startDate)[0];

      if (!day?.day) {
        if (date.display === 'today' && !today) {
          const todayDate = new Date().toJSON().split('T')[0];
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
                'no task' :
                dataType === 'templates' ?
                  'no templates' :
                  'no types',
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

      if (daysData.length < 7) {
        if (new Date(date.endDate) - todayDate < 0) {
          console.log(days);
          const start = date.startDate;

          const end =
            (daysData.length === 0) || (new Date(date.startDate) - new Date(daysData.at(-1)?.day) <= 0) ?
              date.endDate : newDate(daysData.at(-1)?.day, '-', 1);

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
            new Date(
              todayDate.setDate(todayDate.getDate() + 1)
            ).toJSON()?.split('T')[0],
            date.endDate
          ).map((d) => ({ day: d }));
          const all = daysData.concat(neededDays).sort((a, b) => a?.day?.localeCompare(b?.day));

          setData(all);
        }
      } else {
        setData(daysData)
      }
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
      />
    </>
  )
}

export default AnalyticsChart
