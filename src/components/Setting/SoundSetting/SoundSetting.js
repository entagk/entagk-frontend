import React, { Suspense, lazy } from 'react';

import Loading from '../../../utils/Components/Loading/Loading';

const Sound = lazy(() => import('./Sound/Sound'));

const SoundSetting = ({
  handleChange,
  handleBlur,
  formErrors,
  data,
  setData,
}) => {
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
            handleRepetChange={handleChange}
            handleBlur={handleBlur}
            data={data}
            setData={setData}
            formErrors={formErrors}
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
              handleChange={handleChange}
              data={data}
              setData={setData}
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
            handleChange={handleChange}
            data={data}
            setData={setData}
          />
        </Suspense>
      </div>
    </>
  );
};

export default SoundSetting;
