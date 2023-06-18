import React, { lazy, useEffect, useRef, useState } from 'react';

import { alarmSounds, tickingSounds, clickSounds } from "../../../../actions/timer";

import audioPlayer from '../../../../utils/audioPlayer';

import "./style.css";

const Select = lazy(() => import("../../Select/Select"));

function Sound({ type, data, setData }) {
  const sounds = type === 'alarm' ? alarmSounds : type === 'ticking' ? tickingSounds : clickSounds;
  const audioChanging = useRef(audioPlayer({ src: data[`${type}Type`].src, volume: data[`${type}Volume`] }));
  const [change, setChange] = useState(null);

  useEffect(() => {
    if (change !== null && data[`${type}Type`].name !== 'none') {
      audioChanging.current.changeFile(data[`${type}Type`].src);
      audioChanging.current.chengeVolume(data[`${type}Volume`]);
      audioChanging.current.handlePlay();
    }
    // eslint-disable-next-line
  }, [change]);

  const handleChange = (e) => {
    const value = Number(e.target.value);

    setData({ ...data, [e.target.name]: value });
    setChange(!change);
  }

  return (
    <div className='sound-details'>
      <div className="sound-type">
        <h4>Sound</h4>
        <Select
          data={data}
          options={sounds}
          setData={setData}
          type={`${type}Type`}
          setChange={setChange}
          width={type === "click" ? "200px" : "150px"}
        />
      </div>
      {data[`${type}Type`].name !== "none" && (
        <div className="sound-type">
          <h4>Volume</h4>
          <div className='range-container'>
            <span className='range-value'>{data[`${type}Volume`]}</span>
            <input
              type="range"
              className='range'
              min="10"
              max="100"
              value={data[`${type}Volume`]}
              name={`${type}Volume`}
              onChange={handleChange}
              style={{ background: `linear-gradient(to right, rgba(0, 255, 141, 0.85) 0%, rgba(0, 255, 141, 0.85) ${data[`${type}Volume`]}%, transparent ${data[`${type}Volume`]}%, transparent 100%)` }}
            />
          </div>
        </div>
      )}
      {type === "alarm" && (
        <div className="sound-type" style={{
          flexDirection: "row"
        }}>
          <h4>Repeat</h4>
          <div className='notification-min'>
            <input
              style={{ marginInline: "10px 0" }}
              className={(data?.alarmRepet < 0 || data?.alarmRepet > 60) ? 'error' : undefined}
              type="number"
              min="0"
              max="60"
              defaultValue={data?.alarmRepet}
              name="alarmRepet"
              onChange={handleChange} />
            <p style={{ marginLeft: 10 }}>Sec</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sound;
