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
  const { setting } = useSelector(state => state.timer);

  const [error, setError] = useState("");
  const [data, setData] = useState(setting);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (setting.format === undefined) {
      dispatch(getSetting(setError));
    }
    setData(setting);
    // eslint-disable-next-line
  }, [setting.format]);

  if (setting.format === undefined) {
    return (
      <Loading
        backgroud="transparent"
        width="200"
        height="200"
        cx="50"
        cy="50"
        r="20"
        strokeWidth="2.5"
        color="#ffffff"
        containerHeight="500px"
      />
    )
  }

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: Number(e.target.value) })
  }

  const handleSubmit = async (e) => {
    await e.preventDefault();
    if (data !== setting) {
      await dispatch(modifySetting(data, setError));
    }
    navigate("/");
  }

  return (
    <React.Suspense fallback={
      <Loading
        backgroud="transparent"
        width="200"
        height="200"
        cx="50"
        cy="50"
        r="20"
        strokeWidth="2.5"
        color="#ffffff"
        containerHeight="500px"
      />
    }>
      {error && (
        <Message message={error} type="error" setMessage={setError} />
      )}
      <NavBar />
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
              <p style={{ marginBottom: "10px", fontSize: "18px", fontWeight: 400 }}>Pomodoro</p>
              <TimeInputs name={PERIOD} data={data} setData={setData} />
            </div>
            <div style={{
              width: "fit-content",
              marginTop: '10px'
            }}>
              <p style={{ marginBottom: "10px", fontSize: "18px", fontWeight: 400 }}>Short break</p>
              <TimeInputs name={SHORT} data={data} setData={setData} />
            </div>
            <div style={{
              width: "fit-content",
              marginTop: '10px'
            }}>
              <p style={{ marginBottom: "10px", fontSize: "18px", fontWeight: 400 }}>Long break</p>
              <TimeInputs name={LONG} data={data} setData={setData} />
            </div>
          </div>
        </div>
        <div className='block'>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <h3>Auto start breaks</h3>
            <ToggleButton type="autoBreaks" data={data} setData={setData} />
          </div>
        </div>
        <div className='block'>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <h3>Auto start pomodoros</h3>
            <ToggleButton type="autoPomodors" data={data} setData={setData} />
          </div>
        </div>
        <div className='block'>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <h3>Auto start next task</h3>
            <ToggleButton type="autoStartNextTask" data={data} setData={setData} />
          </div>
        </div>
        <div className='block' style={{ flexDirection: "row" }}>
          <h3>Long Break Interval</h3>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end"
          }}>
            <input
              name='longInterval'
              type="number"
              min="1"
              max="100"
              defaultValue={data.longInterval}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className='block'>
          <h3>Alarm Sound</h3>
          <Sound type="alarm" handleChange={handleChange} data={data} setData={setData} />
        </div>
        <div className='block'>
          <h3>Ticking Sound</h3>
          <Sound type="ticking" handleChange={handleChange} data={data} setData={setData} />
        </div>
        <div className='block'>
          <h3>Click Sound</h3>
          <Sound type="click" handleChange={handleChange} data={data} setData={setData} />
        </div>
        <div className='block' style={{ flexDirection: "row" }}>
          <h3>Focus Mode When Ranning</h3>
          <ToggleButton type="focusMode" data={data} setData={setData} />
        </div>
        <div className='block' style={{ flexDirection: "row", border: "none" }}>
          <h3>Notification</h3>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end"
          }}>
            <Select options={["every", "last"]} data={data} type="notificationType" setData={setData} setChange={() => { }} />
            <input
              style={{ marginInline: "10px 0" }}
              type="number"
              defaultValue={data.notificationInterval}
              name="notificationInterval"
              onChange={handleChange} />
            <p style={{ marginLeft: 10 }}>Min</p>
          </div>
        </div>
        <div className='footer'>
          <button type='button' aria-label='cancel form' onClick={() => navigate("/")}>cancel</button>
          <button className='save' type='submit' aria-label='submit form'>ok</button>
        </div>
      </form>
    </React.Suspense>
  );
}

export default Setting;