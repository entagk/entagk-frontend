import React, { lazy } from 'react';

const TimerSetting = lazy(() => import('../../../Setting/TimerSetting/TimerSetting'));

function TimerStep({ data, setData, handleChange }) {
  return (
    <TimerSetting
      data={data}
      setData={setData}
      handleChange={handleChange}
    />
  );
}

export default TimerStep;
