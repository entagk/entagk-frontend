import React, { useState } from 'react';

import { BiDownArrow, BiUpArrow } from 'react-icons/bi';

function TimeInputs({ name, data, setData }) {
  const [min, setMin] = useState(Number(data?.time[name]) >= 60 ? Math.floor(Number(data?.time[name]) / 60) : 0);
  const [sec, setSec] = useState(Number(data?.time[name]) % 60);

  const onChange = (e) => {
    if (e.target.name === 'min') {
      const realValue = Number(e.target.value) * 60 + sec;
      if (realValue > 60 * 60) {
        setData({ ...data, time: { ...data.time, [name]: 60 * 60 } });
        setMin(60);
      } else {
        setData({ ...data, time: { ...data.time, [name]: realValue } });
        setMin(e.target.value);
      }
      console.log(name, realValue);
    } else {
      const realValue = Number(e.target.value) + (min * 60);
      if (realValue > 60 * 60) {
        setMin(60);
        setSec(0);
        setData({ ...data, time: { ...data.time, [name]: 60 * 60 } });
      } else {
        if (Number(e.target.value) >= 60) {
          setSec(Number(e.target.value) % 60);
          setMin((realValue - (Number(e.target.value) % 60)) / 60);
        } else {
          setSec(Number(e.target.value));
        }
        setData({ ...data, time: { ...data.time, [name]: realValue } });
      }
      console.log(name, realValue);
    }

  }


  const plus = (btnName) => {
    let realValue = sec + (min * 60);
    if (btnName === 'min') {
      if (min < 60) {
        setMin(min + 1);
        realValue = realValue + 60;
      }
    } else {
      if (sec < 59) {
        setSec(sec + 1);
        realValue = realValue + 1;
      } else {
        setMin(min + 1);
        setSec(sec % 59);
        realValue = (min * 60) + (sec % 59);
      }
    }

    setData({ ...data, time: { ...data.time, [name]: realValue } });
  }

  const minus = (btnName) => {
    let realValue = sec + (min * 60);
    if (btnName === 'min') {
      if (min > 0) {
        setMin(min - 1);
        realValue = realValue - 60;
      }
    } else {
      if (sec > 0) {
        setSec(sec - 1);
        realValue--;
      }
    }

    setData({ ...data, time: { ...data.time, [name]: realValue } });
  }

  return (
    <div className='time-input' style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start"
    }}>
      <div className='min-sec-input'>
        <input
          name='min'
          type="number"
          min="0"
          max="60"
          placeholder='min'
          className={min > 60 ? `error ${name}-min` : `${name}-min`}
          value={min}
          onChange={onChange}
        />
        <div className='plus-minus-arrows'>
          <button
            aria-label='plus arrow'
            className='plus-arrow'
            type="button"
            onClick={(e) => plus('min')}
            disabled={min > 60}
          >
            <BiUpArrow />
          </button>
          <button
            aria-label='minus arrow'
            className='minus-arrow'
            type="button"
            onClick={() => minus('min')}
            disabled={min === 0}
          >
            <BiDownArrow />
          </button>
        </div>
      </div>
      <p style={{ marginRight: 10, fontSize: 18 }}>:</p>
      <div className='min-sec-input'>
        <input
          name='sec'
          type="number"
          min="0"
          max="59"
          placeholder="sec"
          className={!min && !sec ? `error ${name}-sec` : `${name}-sec`}
          value={sec}
          onChange={onChange}
        />
        <div className='plus-minus-arrows'>
          <button
            aria-label='plus arrow'
            className='plus-arrow'
            type="button"
            onClick={() => plus('sec')}
            disabled={sec > 59}
          >
            <BiUpArrow />
          </button>
          <button
            aria-label='minus arrow'
            className='minus-arrow'
            type="button"
            onClick={() => minus('sec')}
            disabled={sec === 0}
          >
            <BiDownArrow />
          </button>
        </div>
      </div>
    </div>
  );
}

export default TimeInputs;