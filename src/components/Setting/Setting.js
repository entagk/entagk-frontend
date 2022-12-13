import React, { useState, useEffect, lazy } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LONG, PERIOD, SHORT, getSetting, modifySetting } from '../../actions/timer';

import Loading from '../../utils/Loading';
import Message from '../../utils/Message';

import "./style.css";

const NavBar = lazy(() => import('../NavBar/NavBar'));
const Header = lazy(() => import('./header'));
const Sound = lazy(() => import('./Sound'));
const Select = lazy(() => import('./Select'));
const TimeInputs = lazy(() => import('./timeInputs'));
const ToggleButton = lazy(() => import('./ToggleButton'));

function Setting() {
  const { setting, isLoading, activites, active } = useSelector(state => state.timer);

  const [message, setMessage] = useState({ type: '', message: "" });
  const [data, setData] = useState(setting);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (setting === undefined && !isLoading) {
      dispatch(getSetting(setMessage));
    }
    setData(setting);
    // eslint-disable-next-line
  }, [setting, isLoading]);

  if (setting === undefined) {
    return (
      <Loading
        size="200"
        strokeWidth="2.5"
        color="#ffffff"
        backgroud="transperent"
      />
    )
  }

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: Number(e.target.value) })
  }

  const goBack = () => {
    if (window.navigation.canGoBack) {
      navigate(-1);
    } else {
      navigate("/");
    }
  }

  const handleSubmit = async (e) => {
    await e.preventDefault();

    console.log(data);

    if (Object.values(data.time).includes(0)) {
      setMessage({ message: "Please enter valid time data", type: 'error' });
    }

    if (!data.longInterval) {
      setMessage({ message: "Please enter long break interval", type: 'error' });
    }

    if (!data.notificationInterval) {
      setMessage({ message: "Please enter long break interval", type: 'error' });
    }

    if (data !== setting) {
      await dispatch(modifySetting(data, setMessage));
    }

    goBack();
  }

  return (
    <React.Suspense fallback={
      <Loading
        size="200"
        strokeWidth="5px"
        color="#ffffff"
        backgroud="transperent"
      />
    }>
      {message.message && (
        <Message
          {...message}
          setMessage={setMessage}
        />
      )}
      {(setting && isLoading) && (
        <div className="loading-container" style={{
          position: 'fixed',
          top: '0',
          right: '0',
          background: '#ffffff73',
          width: '100%',
          height: '100%',
          zIndex: '1000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Loading
            size="200"
            strokeWidth="5"
            color={activites[active].color}
            backgroud="transperent"
          />
        </div>
      )}
      <NavBar setMessage={setMessage} />
      <form className='setting' onSubmit={handleSubmit}>
        <Header linkClick={handleSubmit} />
        <div className='block'>
          <h2>Time Setting</h2>
        </div>
        <div className='block' style={{ flexDirection: "row" }}>
          <h3>Timer format</h3>
          <Select
            options={["analog", "digital"]}
            type="format"
            data={data}
            setData={setData}
            setChange={() => { }}
          />
        </div>
        <div className='block'>
          <h3>Time</h3>
          <div className='time-inputs'>
            <div style={{
              width: "fit-content",
              marginTop: '10px'
            }}>
              <p>Pomodoro</p>
              <TimeInputs
                name={PERIOD}
                data={data}
                setData={setData}
              />
            </div>
            <div style={{
              width: "fit-content",
              marginTop: '10px'
            }}>
              <p>Short break</p>
              <TimeInputs
                name={SHORT}
                data={data}
                setData={setData}
              />
            </div>
            <div style={{
              width: "fit-content",
              marginTop: '10px'
            }}>
              <p>Long break</p>
              <TimeInputs
                name={LONG}
                data={data}
                setData={setData}
              />
            </div>
          </div>
        </div>
        <div className='block'>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}>
            <h3 style={{ width: 'fit-content' }}>Auto start breaks</h3>
            <ToggleButton
              type="autoBreaks"
              data={data}
              setData={setData}
            />
          </div>
        </div>
        <div className='block'>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}>
            <h3 style={{ width: 'fit-content' }}>Auto start pomodoros</h3>
            <ToggleButton
              type="autoPomodors"
              data={data}
              setData={setData}
            />
          </div>
        </div>
        <div className='block'>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}>
            <h3 style={{ width: 'fit-content' }}>Auto start next task</h3>
            <ToggleButton
              type="autoStartNextTask"
              data={data}
              setData={setData}
            />
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
        <div className='block'>
          <h3>Alarm Sound</h3>
          <Sound
            type="alarm"
            handleChange={handleChange}
            data={data}
            setData={setData}
          />
        </div>
        <div className='block'>
          <h3>Ticking Sound</h3>
          <Sound
            type="ticking"
            handleChange={handleChange}
            data={data}
            setData={setData}
          />
        </div>
        <div className='block'>
          <h3>Click Sound</h3>
          <Sound
            type="click"
            handleChange={handleChange}
            data={data}
            setData={setData}
          />
        </div>
        <div className='block' style={{ flexDirection: "row" }}>
          <h3>Focus Mode When Ranning</h3>
          <ToggleButton type="focusMode" data={data} setData={setData} />
        </div>
        <div className='block notification' style={{ flexDirection: "row", border: "none" }}>
          <h3>Notification</h3>
          <div className='notification-data'>
            <Select options={["every", "last"]} data={data} type="notificationType" setData={setData} setChange={() => { }} />
            <div className='notification-min'>
              <input
                style={{ marginInline: "10px 0" }}
                className={data?.notificationInterval <= 0 ? 'error' : undefined}
                type="number"
                min="1"
                defaultValue={data?.notificationInterval}
                name="notificationInterval"
                onChange={handleChange} />
              <p style={{ marginLeft: 10 }}>Min</p>
            </div>
          </div>
        </div>
        <div className='footer'>
          <button type='button' aria-label='cancel form' onClick={goBack}>cancel</button>
          <button
            className='save'
            type='submit'
            aria-label='submit form'
            disabled={(data && Object.values(data?.time).includes(0)) || data?.notificationInterval <= 0 || data?.longInterval <= 0}>ok</button>
        </div>
      </form>
    </React.Suspense>
  );
}

export default Setting;