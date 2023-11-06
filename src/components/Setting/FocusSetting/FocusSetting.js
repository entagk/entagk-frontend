import React, { Suspense, lazy } from 'react';

import Loading from '../../../utils/Components/Loading/Loading';

const ToggleButton = lazy(() => import('../../../utils/Components/ToggleButton/ToggleButton'));

const FocusSetting = ({ data, setData }) => {
  return (
    <>
      <div className='block focus' style={{ border: 'none' }}>
        <h3>Focus Mode When Ranning</h3>
        <Suspense fallback={
          <Loading
            size="small"
            color={"#fff"}
            backgroud="transparent"
            paddingBlock='0'
          />
        }>
          <ToggleButton type="focusMode" data={data} setData={setData} />
        </Suspense>
      </div>
    </>
  );
};

export default FocusSetting;
