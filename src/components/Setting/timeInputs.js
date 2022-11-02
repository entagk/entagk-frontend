import React, { useState } from 'react';

function TimeInputs({ name, data, setData }) {
  // console.log(typeof value, name);
  // console.log(name, data);
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
        setData({...data, time: {...data.time, [name]: 60 * 60}});
      } else {
        if (Number(e.target.value) >= 60) {
          setSec(Number(e.target.value) % 60);
          setMin((realValue - (Number(e.target.value) % 60)) / 60);
        } else {
          setSec(Number(e.target.value));
        }
        setData({...data, time: {...data.time, [name]: realValue}});
      }
      console.log(name, realValue);
    }

  }

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start"
    }}>
      <input
        name='min'
        type="number"
        min="0"
        max="60"
        placeholder='min'
        className={`${name}-min`}
        // defaultValue={min}
        value={min}
        onChange={onChange}
      />
      <p style={{ marginRight: 10, fontSize: 18 }}>:</p>
      <input
        name='sec'
        type="number"
        min="1"
        max="60"
        placeholder="sec"
        className={`${name}-sec`}
        // defaultValue={sec}
        value={sec}
        onChange={onChange}
      />
    </div>
  );
}

export default TimeInputs;