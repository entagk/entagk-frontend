import React, { lazy, useEffect, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux';

import { getDay, getDays } from '../../../actions/activities';

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

  useEffect(() => {
    if (dateType === 'day') {
      const day = date.display === 'today' ? today : days.filter(d => d.day === date.startDate)[0];

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
      const daysData = days.filter((d) => {
        if (new Date(d.day) - new Date(date.startDate) === 0 || new Date(d.day) - new Date(date.endDate) === 0) {
          return true;
        } else if (new Date(date.startDate) - new Date(d.day) < 0 && new Date(date.endDate) - new Date(d.day) > 0) {
          return true;
        } else return false;
      });

      if (daysData.length < 7) {
        console.log(days);
        const start =
          daysData.length === 0 ?
            date.startDate :
            new Date(date.endDate) - new Date(daysData.at(-1).day) === 0 ?
              date.startDate :
              new Date(
                new Date(daysData.at(-1)?.day).setDate(
                  new Date(daysData.at(-1)?.day).getDate() + 1
                )
              ).toJSON().split('T')[0];

        const end =
          daysData.length === 0 ?
            date.endDate :
            new Date(date.endDate) - new Date(daysData.at(-1).day) === 0 ?
              new Date(
                new Date(daysData.at(-1)?.day).setDate(
                  new Date(daysData.at(-1)?.day).getDate() - 1
                )
              ).toJSON().split('T')[0] : date.endDate;

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
