import React, { lazy } from 'react';

const SoundSetting = lazy(() => import('../../../Setting/SoundSetting/SoundSetting'));

function SoundStep(props) {
  return (
    <SoundSetting
      {...props}
    />
  );
}

export default SoundStep;
