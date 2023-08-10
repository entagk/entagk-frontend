import React, { lazy } from 'react';

const SoundSetting = lazy(() => import('../../Setting/SoundSetting/SoundSetting'));
const TimerSetting = lazy(() => import('../../Setting/TimerSetting/TimerSetting'));

function MoreSetting({
  setting,
  setSetting,
  setFormErrors,
  required,
  validations,
  ...requiredForEveryStatus
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSetting({ ...setting, [name]: Number(value) })

    if (
      value !== ''
    ) {
      setFormErrors(fep => ({ ...fep, [name]: '' }));
    }
  }

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (value === '' && required.includes(name)) {
      setFormErrors(fep => ({ ...fep, [name]: 'This field is required' }));
    } else {
      validations[name](value);
    }
  }

  return (
    <>
      <TimerSetting
        {...requiredForEveryStatus}
        data={setting}
        setData={setSetting}
        handleChange={handleChange}
        handleBlur={handleBlur}
        validations={validations}
      />
      <SoundSetting
        {...requiredForEveryStatus}
        data={setting}
        setData={setSetting}
        handleChange={handleChange}
        handleBlur={handleBlur}
        validations={validations}
      />
    </>
  );
}

export default MoreSetting;
