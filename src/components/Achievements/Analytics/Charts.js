import React, { lazy } from 'react';

import Loading from '../../../utils/Loading/Loading';
import StackedBarChart from '../../../utils/Charts/StackedBarChart';

const Chart = lazy(() => import('../../../utils/Charts/Chart'));

const Charts = ({ isLoading, data, dataType, dateType }) => {
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
                  <Chart data={data} />
                </>
              )}
            </>
          ) : dateType === 'week' ? (
            <>
              {/* {data.map(d => d[dataType]).flat(Infinity).length === 0 ? (
                <p>No activities at this time</p>
              ) : ( */}
                <StackedBarChart daysData={data} dataType={dataType} />
              {/* )} */}
            </>
          ) : (<>

          </>)}
        </>
      )}
    </div>
  )
}

export default Charts
