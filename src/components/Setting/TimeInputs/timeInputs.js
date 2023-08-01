import React, { useState, lazy } from 'react';

import "./style.css";

const PlusMinusArrow = lazy(() => import('./PlusMinusArrow'));

function TimeInputs({
  name,
  data,
  setData,
  formErrors,
  setFormErrors,
  validations,
}) {
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

    if (formErrors.time[name]) {
      setFormErrors(pFE => ({ ...pFE, time: { ...pFE.time, [name]: "" } }))
    }
  }

  const handleBlur = (e) => {
    if (e.target.name === 'min')
      validations.time[name](Number(e.target.value) * 60 + sec);
    else
      validations.time[name](Number(e.target.value) + min * 60);
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
    <div className='time'>
      <div style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <h4>{name === 'PERIOD' ? 'Pomodoro' : name.toLocaleLowerCase()}</h4>
        <div className='time-input' style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
        }}>
          <div className='min-sec-input' style={{ width: 'fit-content' }}>
            <input
              name='min'
              type="number"
              min="0"
              max="60"
              placeholder='min'
              className={formErrors?.time[name] ? `error ${name}-min` : `${name}-min`}
              value={min}
              onChange={onChange}
              onBlur={handleBlur}
            />
            <PlusMinusArrow
              value={min}
              minus={minus}
              plus={plus}
              min={0}
              max={60}
              name='min'
            />
          </div>
          <p style={{ marginInline: 10, fontSize: 18 }}>:</p>
          <div className='min-sec-input' style={{ width: 'fit-content' }}>
            <input
              name='sec'
              type="number"
              min="0"
              max="59"
              placeholder="sec"
              className={formErrors?.time[name] ? `error ${name}-sec` : `${name}-sec`}
              value={sec}
              onChange={onChange}
              onBlur={handleBlur}
            />
            <PlusMinusArrow
              value={min}
              name='sec'
              minus={minus}
              plus={plus}
              min={0}
              max={59}
            />
          </div>
        </div>
      </div>
      {
        formErrors?.time[name] && (
          <>
            <span className='error-text'>{formErrors?.time[name]}</span>
          </>
        )
      }
    </div>
  );
}

export default TimeInputs;
