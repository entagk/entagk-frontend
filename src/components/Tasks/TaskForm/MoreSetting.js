import React, { lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';

import Loading from '../../../utils/Loading';

const SoundSetting = lazy(() => import('../../Setting/SoundSetting/SoundSetting'));
const TimerSetting = lazy(() => import('../../Setting/TimerSetting/TimerSetting'));

function MoreSetting({ setting, setSetting }) {
  const {active, activites} = useSelector(state => state.timer);

  const handleChange = (e) => {
    setSetting({ ...setting, [e.target.name]: Number(e.target.value) })
  }

  return (
    <Suspense fallback={<Loading
      size="100"
      strokeWidth="5"
      color={activites[active].color}
      backgroud="transperent"
    />}>
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
    </Suspense>
  );
}

export default MoreSetting;
