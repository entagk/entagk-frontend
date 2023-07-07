import React from 'react';
import SoundSetting from '../../../Setting/SoundSetting/SoundSetting';

function SoundStep({ data, setData, handleChange }) {
  return (
    <SoundSetting
      data={data}
      setData={setData}
      handleChange={handleChange}
    />
  );
}

export default SoundStep;
