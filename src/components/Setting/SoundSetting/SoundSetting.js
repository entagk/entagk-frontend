import React, { Suspense, lazy } from 'react';

import Loading from '../../../utils/Components/Loading/Loading';

const Sound = lazy(() => import('./Sound/Sound'));

const SoundSetting = ({
  handleChange,
  handleBlur,
  formErrors,
  data,
  setData,
  setMessage
}) => {

  const requiredForEverySound = {
    handleRepetChange: handleChange,
    handleBlur,
    data,
    setData,
    formErrors,
    setMessage,
  }

  return (
    <>
      <div className='block'>
        <h3>Alarm Sound</h3>
        <Suspense fallback={
          <Loading
            size="small"
            color={"#fff"}
            backgroud="transparent"
            paddingBlock='0'
          />
        }>
          <Sound
            type="alarm"
            {...requiredForEverySound}
          />
        </Suspense>
      </div>
      {(data?.clickType && data?.clickVolume) && (
        <div className='block'>
          <h3>Click Sound</h3>
          <Suspense fallback={
            <Loading
              size="small"
              color={"#fff"}
              backgroud="transparent"
              paddingBlock='0'
            />
          }>
            <Sound
              type="click"
              {...requiredForEverySound}
            />
          </Suspense>
        </div>
      )}
      <div className='block' style={{ border: 'none' }}>
        <h3>Ticking Sound</h3>
        <Suspense fallback={
          <Loading
            size="small"
            color={"#fff"}
            backgroud="transparent"
            paddingBlock='0'
          />
        }>
          <Sound
            type="ticking"
            {...requiredForEverySound}
          />
        </Suspense>
      </div>
    </>
  );
};

export default SoundSetting;
