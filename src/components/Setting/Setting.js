import React, { useState, useEffect, lazy } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSetting, modifySetting } from '../../actions/timer';

import { AiFillSound } from 'react-icons/ai';
import { BsArrowRight } from 'react-icons/bs';
import { CgTimelapse } from 'react-icons/cg';
import { MdNotifications } from 'react-icons/md';
import { TbFocus } from 'react-icons/tb';

import Loading from '../../utils/Loading';
import Message from '../../utils/Message';

import "./style.css";
const Header = lazy(() => import('./SettingHeader/header'));
const TimerSetting = lazy(() => import('./TimerSetting/TimerSetting'));
const SoundSetting = lazy(() => import('./SoundSetting/SoundSetting'));
const NotificationSetting = lazy(() => import('./NotificationSetting/NotificationSetting'));
const FocusSetting = lazy(() => import('./FocusSetting/FocusSetting'));

function Setting({ setOpenSetting }) {
  const { setting, isLoading, activites, active } = useSelector(state => state.timer);

  const [message, setMessage] = useState({ type: '', message: "" });
  const [data, setData] = useState(setting);
  const [status, setStatus] = useState('');
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

    const dataSent = { ...data };

    Object.entries(data).forEach(([key, value]) => {
      if (data[key] === setting[key]) {
        delete dataSent[key];
        // setData(data);
      } else {
        console.log(key, value);
      }
    });

    if (Object.entries(dataSent).length !== 0) {
      await dispatch(modifySetting(dataSent, setMessage));
    }

    setOpenSetting(false);
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
      <form className='glass-effect setting zoom-in' onSubmit={handleSubmit}>
        <Header linkClick={handleSubmit} status={status} setStatus={setStatus} />
        <>
          {status === '' ? (
            <>
              <div className='setting-menu'>
                <button
                  aria-label='timer setting button'
                  type='button'
                  onClick={() => setStatus('timer')}>
                  <span style={{ marginRight: "40px" }}>
                    <CgTimelapse />
                    <span className='text'>Timer Setting </span>
                  </span> <BsArrowRight />
                </button>
                <button
                  aria-label='sounds setting button'
                  type='button'
                  onClick={() => setStatus('sounds')}>
                  <span style={{ marginRight: "40px" }}>
                    <AiFillSound />
                    <span className='text'>Sounds Setting</span>
                  </span> <BsArrowRight />
                </button>
                {"Notification" in window && (
                  <button
                    aria-label='notifications setting button'
                    type='button'
                    onClick={() => setStatus('notifications')}>
                    <span style={{ marginRight: "40px" }}>
                      <MdNotifications />
                      <span className='text'>Notifications Setting</span>
                    </span> <BsArrowRight />
                  </button>
                )}
                <button
                  aria-label='focus setting button'
                  type='button'
                  onClick={() => setStatus('focus')}>
                  <span style={{ marginRight: "40px" }}>
                    <TbFocus />
                    <span className='text'>Focus Setting</span>
                  </span> <BsArrowRight />
                </button>
              </div>
            </>
          ) : status === 'timer' ? (
            <>
              <TimerSetting data={data} setData={setData} handleChange={handleChange} />
            </>
          ) : status === 'sounds' ? (
            <>
              <SoundSetting data={data} setData={setData} handleChange={handleChange} />
            </>
          ) : (status === 'notifications' && "Notification" in window) ? (
            <>
              <NotificationSetting data={data} setData={setData} handleChange={handleChange} />
            </>
          ) : (
            <>
              <FocusSetting data={data} setData={setData} handleChange={handleChange} />
            </>
          )}
        </>

        <div className='footer'>
          <button type='button' aria-label='cancel form' onClick={() => setOpenSetting(false)}>cancel</button>
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
