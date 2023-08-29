import React, { lazy, useEffect, useState } from 'react';

import Loading from '../../../utils/Loading/Loading';

import { filterDuplicatedData } from '../../../utils/helper';

import './style.css';
import YearChart from '../../../utils/Charts/YearChart/YearChart';

const Chart = lazy(() => import('../../../utils/Charts/Chart'));
const Pie = lazy(() => import('../../../utils/Charts/Pie'));
const StackedBarChart = lazy(() => import('../../../utils/Charts/StackedBarChart'));
const MonthChart = lazy(() => import('../../../utils/Charts/MonthChart/MonthChart'));

const Charts = ({
  isLoading,
  data,
  dataType,
  chart,
  dateType,
  date,
  setDate,
  setDateType
}) => {
  const [pieData, setPieData] = useState([]);

  useEffect(() => {
    if (chart === 'pie') {
      if (dateType === 'week') {
        const newTasks = [];
        filterDuplicatedData(data, 'day').sort((a, b) => a?.day?.localeCompare(b?.day))?.map((d) => {
          const dayTasks = d?.[dataType] || [];
          const totalMins = dayTasks ? dayTasks?.reduce((p, c) => p + c?.totalMins, 0) : 0;
          if (d.totalMins !== totalMins && d.totalMins > 0) {
            const unknownName = dataType === 'tasks' ? "unknown task" : dataType === 'templates' ? 'unknown template' : 'unknown type';
            dayTasks.push({ name: unknownName, totalMins: d.totalMins - totalMins });
          }

          return dayTasks;
        }).flat(Infinity).forEach((t, i) => {
          const founded = newTasks.find((task) => t.name === task.name);
          if (founded) {
            founded.totalMins += t.totalMins;
          } else newTasks.push(t);
        });

        setPieData(newTasks);
      } else {
        setPieData(data);
      }
    }
  }, [data, dataType, dateType, chart]);

  console.log(data);

  return (
    <div
      className='chart-container'
    >
      {isLoading ? (
        <Loading
          color="var(--main-color)"
          backgroud="transparent"
          size="big"
        />
      ) : (
        <>
          {dateType === 'day' ? (
            <>
              {data.length === 0 ? (
                <p className='no-activities'>No activities during this period</p>
              ) : (
                <>
                  {chart === 'pie' ? (
                    <Pie data={data} />
                  ) : (
                    <Chart data={data} />
                  )}
                </>
              )}
            </>
          ) : dateType === 'week' ? (
            <>
              {chart === 'pie' ? (
                <Pie
                  data={pieData}
                  dateType={dateType}
                  dataType={dataType}
                />
              ) : (
                <StackedBarChart
                  daysData={data}
                  dataType={dataType}
                  setDateType={setDateType}
                  setDate={setDate}
                />
              )}
            </>
          ) : dateType === 'month' ? (
            <>
              <MonthChart
                date={date}
                data={data}
                setDateType={setDateType}
                setDate={setDate}
              />
            </>
          ) : (
            <>
              {data.every((d) => ('day' in d)) && (
                <YearChart data={data} />
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}

export default Charts
