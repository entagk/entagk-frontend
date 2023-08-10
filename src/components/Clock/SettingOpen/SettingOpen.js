import React from 'react';
import { AiOutlineSetting } from "react-icons/ai";
import Button from '../../../utils/Button/Button';

function SettingOpen({ setOpenSetting }) {
  return (
    <Button
      aria-label='small external window'
      className='timer-button setting-open'
      type="button"
      onClick={() => setOpenSetting(true)}
      color='main'
      variant='single-icon'
      startIcon={
        <>
          <AiOutlineSetting />
        </>
      }
    />
  );
}

export default SettingOpen;
