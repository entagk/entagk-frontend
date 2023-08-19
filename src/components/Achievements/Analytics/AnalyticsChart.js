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
        }
      }
    } else if (date.startDate !== date.endDate) {
      
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
      <Charts data={data} isLoading={isLoading} dataType={dataType} />
    </>
  )
}

export default AnalyticsChart
