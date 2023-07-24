import React, { lazy } from 'react';

const SoundSetting = lazy(() => import('../../../Setting/SoundSetting/SoundSetting'));

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
