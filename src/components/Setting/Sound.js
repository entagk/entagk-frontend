import React, { lazy, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import { alarmSounds, tickingSounds, clickSounds } from "../../actions/timer";

import audioPlayer from '../../utils/audioPlayer';

const Select = lazy(() => import("./Select"));
const ToggleButton = lazy(() => import("./ToggleButton"));

function Sound({ handleChange, type, data, setData }) {
  const sounds = type === 'alarm' ? alarmSounds : type === 'ticking' ? tickingSounds : clickSounds;
  const audioChanging = useRef(audioPlayer({ src: data[`${type}Type`].src, volume: data[`${type}Volume`] }));
  const { setting } = useSelector(state => state.timer);

  useEffect(() => {
    if ((setting[`${type}Type`] !== data[`${type}Type`] || setting[`${type}Volume`] !== [`${type}Volume`]) && data[`${type}Type`].name !== 'none') {
      audioChanging.current.changeFile(data[`${type}Type`].src);
      audioChanging.current.chengeVolume(data[`${type}Volume`]);
      audioChanging.current.handlePlay();
    }
    // eslint-disable-next-line
  }, [data[`${type}Type`], data[`${type}Volume`]]);

  return (
    <div className='alarm-details'>
      <div className="alarm-type">
        <p
          style={{ width: "inherit", fontSize: 18, fontWeight: 400 }}
        >Sound type</p>
        <Select
          data={data}
          options={sounds}
          setData={setData}
          type={`${type}Type`}
        />
      </div>
      {data[`${type}Type`].name !== "none" && (
        <div className="alarm-type">
          <p
            style={{ width: "inherit", fontSize: 18, fontWeight: 400 }}
          >Sound Volume</p>
          <div className='range-container'>
            <p>{data[`${type}Volume`]}</p>
            <input
              type="range"
              className='range'
              min="0"
              max="100"
              value={data[`${type}Volume`]}
              name={`${type}Volume`}
              onChange={handleChange}
            />
          </div>
        </div>
      )}
      {type === "alarm" && (
        <div className="alarm-type">
          <p style={{ width: "inherit", fontSize: 18, fontWeight: 400 }}>Repet</p>
          <ToggleButton type="alarmRepet" data={data} setData={setData} />
        </div>
      )}
    </div>
  );
}

export default Sound;