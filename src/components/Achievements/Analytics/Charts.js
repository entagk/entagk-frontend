import React, { lazy, useEffect, useState } from 'react';

import Loading from '../../../utils/Loading/Loading';

import { filterDuplicatedData } from '../../../utils/helper';

import './style.css';

const Chart = lazy(() => import('../../../utils/Charts/Chart'));
const Pie = lazy(() => import('../../../utils/Charts/Pie'));
const StackedBarChart = lazy(() => import('../../../utils/Charts/StackedBarChart'));

const Charts = ({ isLoading, data, dataType, chart, dateType }) => {
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

  return (
    <div
      className='chart-container'
      style={{
        marginBlock: '20px',
        width: "100%",
        textAlign: "center"
      }}>
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
                <p>No activities at this time</p>
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
                />
              )}
            </>
          ) : (<></>)}
        </>
      )}
    </div>
  )
}

export default Charts
