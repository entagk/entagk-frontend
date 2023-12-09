import React, { Suspense, lazy } from 'react';

import { LONG, PERIOD, SHORT } from "../../../actions/timer";

import Loading from '../../../utils/Components/Loading/Loading';

const Select = lazy(() => import('../../../utils/Components/Select/Select'));
const TimeInputs = lazy(() => import('../TimeInputs/timeInputs'));
const ToggleButton = lazy(() => import('../../../utils/Components/ToggleButton/ToggleButton'));

const AutomaticOption = ({ data, index, automations, auto, setData }) => (
  <div style={{
    border: index === automations.length - 1 ? 'none' : '',
    marginBottom: index + 1 !== automations.length ? '10px' : "0"
  }} key={index}>
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
    }}>
      <h3 style={{ width: 'fit-content' }}>{auto.name}</h3>
      <Suspense fallback={
        <Loading
          size="small"
          color={"#fff"}
          backgroud="transparent"
          paddingBlock='0'
        />
      }>
        <ToggleButton
          type={auto.type}
          data={data}
          setData={setData}
        />
      </Suspense>
    </div>
  </div>
)

const TimerSetting = ({
  handleChange,
  handleBlur,
  formErrors,
  setFormErrors,
  data,
  setData,
  validations
}) => {
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
    },
    {
      type: "applyTaskSetting",
      name: "Apply task setting"
    }
  ]

  return (
    <>
      {data?.format && (
        <div className='block' style={{ flexDirection: "row" }}>
          <h3 style={{ width: '100%' }}>Timer format</h3>
          <Suspense fallback={
            <Loading
              size="small"
              color={"#fff"}
              backgroud="transparent"
              paddingBlock='0'
            />
          }>
            <Select
              options={["analog", "digital"]}
              type="format"
              data={data}
              setData={setData}
              setChange={() => { }}
              width="106px"
            />
          </Suspense>
        </div>
      )}
      <div className='block'>
        <div className='time-inputs'>
          {[PERIOD, SHORT, LONG].map((item, index) => (
            <>
              <Suspense fallback={
                <Loading
                  size="small"
                  color={"#fff"}
                  backgroud="transparent"
                  paddingBlock='0'
                />
              }>
                <TimeInputs
                  name={item}
                  data={data}
                  setData={setData}
                  formErrors={formErrors}
                  setFormErrors={setFormErrors}
                  validations={validations}
                />
              </Suspense>
            </>
          ))}
        </div>
      </div>
      <div className='block'>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <h3>Long Break Interval</h3>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            width: 'fit-content'
          }}>
            <input
              className={formErrors?.longInterval ? 'error' : undefined}
              name='longInterval'
              type="number"
              min="1"
              max="100"
              defaultValue={data?.longInterval}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
        </div>
        {formErrors.longInterval && (
          <div>
            <span className='error-text'>{formErrors.longInterval}</span>
          </div>
        )}
      </div>
      <div className='block'>
        {automations.map((auto, index) => (
          <>
            {index === 3 ? (
              <>
                {
                  "focusMode" in data && index === 3 && (
                    <AutomaticOption
                      index={index}
                      data={data}
                      automations={automations}
                      auto={auto}
                      setData={setData}
                    />
                  )
                }
              </>
            ) : (
              <AutomaticOption
                index={index}
                data={data}
                automations={automations}
                auto={auto}
                setData={setData}
              />
            )}
          </>
        ))}
      </div>
    </>
  );
};

export default TimerSetting;
