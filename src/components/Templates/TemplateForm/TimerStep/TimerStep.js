import React from 'react';
import TimerSetting from '../../../Setting/TimerSetting/TimerSetting';

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
