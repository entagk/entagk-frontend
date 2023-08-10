import React, { lazy } from 'react';

const TimerSetting = lazy(() => import('../../../Setting/TimerSetting/TimerSetting'));

function TimerStep(props) {
  console.log(props);
  return (
    <TimerSetting
      {...props}
    />
  );
}

export default TimerStep;
