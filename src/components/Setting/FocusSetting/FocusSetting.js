import React, { lazy } from 'react';

const ToggleButton = lazy(() => import('../ToggleButton/ToggleButton'));

const FocusSetting = ({ data, setData }) => {
  return (
    <>
      <div className='block focus' style={{ border: 'none' }}>
        <h3>Focus Mode When Ranning</h3>
        <ToggleButton type="focusMode" data={data} setData={setData} />
      </div>
    </>
  );
};

export default FocusSetting;
