import React, { lazy } from 'react';

const SoundSetting = lazy(() => import('../../Setting/SoundSetting/SoundSetting'));
const TimerSetting = lazy(() => import('../../Setting/TimerSetting/TimerSetting'));

function MoreSetting({ setting, setSetting }) {
  const handleChange = (e) => {
    setSetting({ ...setting, [e.target.name]: Number(e.target.value) })
  }

  return (
    <>
      <TimerSetting
        data={setting}
        setData={setSetting}
        handleChange={handleChange}
      />
      <SoundSetting
        data={setting}
        setData={setSetting}
        handleChange={handleChange}
      />
    </>
  );
}

export default MoreSetting;
