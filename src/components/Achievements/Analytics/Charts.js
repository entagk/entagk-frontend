import React, { lazy } from 'react';

import Loading from '../../../utils/Loading/Loading';

const Chart = lazy(() => import('../../../utils/Charts/Chart'));

const Charts = ({ isLoading, data, dataType }) => {
  console.log(data);
  console.log(isLoading);

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
          {data.length === 0 ? (
            <p>No activities at this time</p>
          ) : (
            <>
              <Chart data={data} />
            </>
          )}
        </>
      )}
    </div>
  )
}

export default Charts
