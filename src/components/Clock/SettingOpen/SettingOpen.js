import React from 'react';
import { AiOutlineSetting } from "react-icons/ai";

function SettingOpen({ setOpenSetting }) {
  return (
    <button
      aria-label='small external window'
      className='timer-button setting-open'
      type="button"
      onClick={() => setOpenSetting(true)}>
      <AiOutlineSetting />
    </button>
  );
}

export default SettingOpen;
