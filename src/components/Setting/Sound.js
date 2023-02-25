import React, { lazy, useEffect, useRef, useState } from 'react';

import { alarmSounds, tickingSounds, clickSounds } from "../../actions/timer";

import audioPlayer from '../../utils/audioPlayer';

const Select = lazy(() => import("./Select"));
const ToggleButton = lazy(() => import("./ToggleButton"));

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
    setData({ ...data, [e.target.name]: Number(e.target.value) });
    setChange(!change);
  }

  return (
    <div className='alarm-details'>
      <div className="alarm-type">
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
        <div className="alarm-type">
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
        <div className="alarm-type" style={{
          flexDirection: "row"
        }}>
          <h4>Repeat</h4>
          <ToggleButton type="alarmRepet" data={data} setData={setData} />
        </div>
      )}
    </div>
  );
}

export default Sound;
