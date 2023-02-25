import React, { lazy } from 'react';

const Sound = lazy(() => import('../Sound'));

const SoundSetting = ({ handleChange, data, setData }) => {
  return (
    <>
      <div className='block'>
        <h3>Alarm Sound</h3>
        <Sound
          type="alarm"
          handleChange={handleChange}
          data={data}
          setData={setData}
        />
      </div>
      <div className='block'>
        <h3>Click Sound</h3>
        <Sound
          type="click"
          handleChange={handleChange}
          data={data}
          setData={setData}
        />
      </div>
      <div className='block' style={{ border: 'none' }}>
        <h3>Ticking Sound</h3>
        <Sound
          type="ticking"
          handleChange={handleChange}
          data={data}
          setData={setData}
        />
      </div>
    </>
  );
};

export default SoundSetting;
