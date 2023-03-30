import React, { lazy } from 'react';

import { LONG, PERIOD, SHORT } from "../../../actions/timer";

const Select = lazy(() => import('../Select'));
const TimeInputs = lazy(() => import('../timeInputs'));
const ToggleButton = lazy(() => import('../ToggleButton'));

const TimerSetting = ({ handleChange, data, setData }) => {
  const automations = [
    {
      type: "autoBreaks",
      name: "Auto start breaks"
    },
    {
      type: "autoPomodors",
      name: "Auto start pomodoros"
    },
    {
      type: "autoStartNextTask",
      name: "Auto start next task"
    }
  ]

  return (
    <>
      <div className='block' style={{ flexDirection: "row" }}>
        <h3>Timer format</h3>
        <Select
          options={["analog", "digital"]}
          type="format"
          data={data}
          setData={setData}
          setChange={() => { }}
          width="106px"
        />
      </div>
      <div className='block'>
        <h3>Time</h3>
        <div className='time-inputs'>
          {[PERIOD, SHORT, LONG].map((item, index) => (
            <div className='time' key={index}>
              <h4>{index === 0 ? 'Pomodoro' : item.toLocaleLowerCase()}</h4>
              <TimeInputs
                name={item}
                data={data}
                setData={setData}
              />
            </div>
          ))}
        </div>
      </div>
      <div className='block' style={{ flexDirection: "row" }}>
        <h3>Long Break Interval</h3>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          width: 'fit-content'
        }}>
          <input
            className={data?.longInterval <= 0 ? 'error' : undefined}
            name='longInterval'
            type="number"
            min="1"
            max="100"
            defaultValue={data?.longInterval}
            onChange={handleChange}
          />
        </div>
      </div>
      {automations.map((auto, index) => (
        <div className='block' style={{ border: index === automations.length-1 ? 'none' : '' }} key={index}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}>
            <h3 style={{ width: 'fit-content' }}>{auto.name}</h3>
            <ToggleButton
              type={auto.type}
              data={data}
              setData={setData}
            />
          </div>
        </div>
      ))}
    </>
  );
};

export default TimerSetting;
