import React, { lazy, useEffect, useRef, useState } from 'react';

import { getGeneralSounds } from "../../../../actions/timer";

import audioPlayer from '../../../../utils/audioPlayer';

import "./style.css";
import { useSelector, useDispatch } from 'react-redux';
import Loading from '../../../../utils/Components/Loading/Loading';

const Select = lazy(() => import("../../../../utils/Components/Select/Select"));

function Sound({
  type,
  data,
  setData,
  handleBlur,
  handleRepetChange,
  formErrors,
  setMessage
}) {
  // const sounds = type === 'alarm' ? alarmSounds : type === 'ticking' ? tickingSounds : clickSounds;
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const sounds = useSelector(state => state.timer.sounds?.[type]);
  const audioChanging = useRef(audioPlayer({ src: data[`${type}Type`].src, volume: data[`${type}Volume`] }));
  const [change, setChange] = useState(null);

  useEffect(() => {
    if (!sounds || sounds?.files?.length === 0) {
      dispatch(getGeneralSounds(type, setIsLoading, setMessage));
    }

    // eslint-disable-next-line
  }, [sounds]);

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
        {(isLoading || sounds?.files?.length === 0) ? (
          <Loading
            size="small"
            color={"#fff"}
            backgroud="transparent"
            paddingBlock='0'
          />
        ) : (
          <Select
            data={data}
            options={sounds?.files}
            setData={setData}
            type={`${type}Type`}
            setChange={setChange}
            width={type === "click" ? "200px" : "150px"}
          />
        )}
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
          flexDirection: "column"
        }}>
          <div className='sound-type'>
            <h4>Repeat</h4>
            <div className='notification-min'>
              <input
                style={{ marginInline: "10px 0" }}
                className={formErrors.alarmRepet ? 'error' : undefined}
                type="number"
                min="0"
                max="60"
                defaultValue={data?.alarmRepet}
                name="alarmRepet"
                onChange={handleRepetChange}
                onBlur={handleBlur}
              />
              <p style={{ marginLeft: 10 }}>Sec</p>
            </div>
          </div>
          {
            formErrors?.alarmRepet && (
              <>
                <span className='error-text'>{formErrors?.alarmRepet}</span>
              </>
            )
          }
        </div>
      )}
    </div>
  );
}

export default Sound;
