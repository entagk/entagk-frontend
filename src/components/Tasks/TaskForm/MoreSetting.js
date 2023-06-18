import React, { useState } from 'react';
import SoundSetting from '../../Setting/SoundSetting/SoundSetting';
import TimerSetting from '../../Setting/TimerSetting/TimerSetting';


// 
/**
  "setting": {
    // "time": {
    //   "PERIOD": 1500,
    //   "SHORT": 300,
    //   "LONG": 900
    // },
    "timeForAll": true,
    // "autoBreaks": false,
    // "autoPomodors": false,
    // "autoStartNextTask": false,
    // "longInterval": 4,
    "alarmType": {
      "name": "alarm 1",
      "src": "sounds/alarm/1.mp3"
    },
    "alarmVolume": 50,
    "alarmRepet": 0,
    "tickingType": {
        "name": "tricking 1",
        "src": "sounds/tricking/1.mp3"
    },
    "tickingVolume": 50
  },
 */

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
