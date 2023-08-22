import React, { lazy } from 'react';

import Loading from '../../../utils/Loading/Loading';
import StackedBarChart from '../../../utils/Charts/StackedBarChart';

const Chart = lazy(() => import('../../../utils/Charts/Chart'));
const Pie = lazy(() => import('../../../utils/Charts/Pie'));

const Charts = ({ isLoading, data, dataType, chart, dateType }) => {
  console.log(chart);

  return (
    <div className='chart-container' style={{ marginBlock: '20px', width: "100%", textAlign: "center" }}>
      {isLoading ? (
        <Loading
          color="white"
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
                <Pie data={data} />
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
