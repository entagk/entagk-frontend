import React, { useState, useEffect, lazy } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSetting, modifySetting } from '../../actions/timer';

import { AiFillSound } from 'react-icons/ai';
import { BsArrowRight } from 'react-icons/bs';
import { CgTimelapse } from 'react-icons/cg';
import { MdNotifications } from 'react-icons/md';
import { TbFocus } from 'react-icons/tb';

import Loading from '../../utils/Loading/Loading';
import Message from '../../utils/Message';
import NetworkError from '../NetworkError/NetworkError';

import "./style.css";
import Button from '../../utils/Button/Button';
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
        size="big"
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
        size="big"
        color="#ffffff"
        backgroud="transparant"
        className="center-fullpage"
      />
    }>
      {message.message && (
        <>
          {(!message.message.includes('Network Error')) ? (
            <Message {...message} setMessage={setMessage} />
          ) : (
            <NetworkError />
          )}
        </>
      )}
      <form className='glass-effect setting zoom-in' onSubmit={handleSubmit}>
        {(setting && isLoading) && (
          <Loading
            size="big"
            color={activites[active].color}
            backgroud="transparant"
            style={{
              backgroud: "#ffffff73",
              margin: 0,
              background: '#ffffff30',
              borderRadius: 'inherit',
              border: 'inherit',
            }}
            className="center-fullpage"
          />
        )}
        <Header linkClick={handleSubmit} status={status} setStatus={setStatus} />
        <>
          {status === '' ? (
            <>
              <div className='setting-menu'>
                <Button
                  aria-label='timer setting button'
                  type='button'
                  onClick={() => setStatus('timer')}
                  variant='none'
                  endIcon={
                    <BsArrowRight />
                  }
                >
                  <span style={{ marginRight: "40px" }}>
                    <CgTimelapse />
                    <span className='text'>Timer Setting </span>
                  </span>
                </Button>
                <Button
                  aria-label='sounds setting button'
                  type='button'
                  variant='none'
                  endIcon={
                    <BsArrowRight />
                  }
                  onClick={() => setStatus('sounds')}>
                  <span style={{ marginRight: "40px" }}>
                    <AiFillSound />
                    <span className='text'>Sounds Setting</span>
                  </span>
                </Button>
                {"Notification" in window && (
                  <Button
                    aria-label='notifications setting button'
                    type='button'
                    variant='none'
                    endIcon={
                      <BsArrowRight />
                    }
                    onClick={() => setStatus('notifications')}>
                    <span style={{ marginRight: "40px" }}>
                      <MdNotifications />
                      <span className='text'>Notifications Setting</span>
                    </span>
                  </Button>
                )}
                <Button
                  aria-label='focus setting button'
                  type='button'
                  variant='none'
                  endIcon={
                    <BsArrowRight />
                  }
                  onClick={() => setStatus('focus')}>
                  <span style={{ marginRight: "40px" }}>
                    <TbFocus />
                    <span className='text'>Focus Setting</span>
                  </span>
                </Button>
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
          <Button
            className='save'
            type='submit'
            aria-label='submit form'
            disabled={
              (data && Object.values(data?.time).includes(0)) ||
              data?.notificationInterval <= 0 ||
              data?.longInterval <= 0 ||
              (data?.alarmRepet < 0 || data?.alarmRepet > 60)
            }
            variant='contained'
            color="main"
          >Ok</Button>
          <Button
            type='button'
            aria-label='cancel form'
            onClick={() => setOpenSetting(false)}
            variant='outlined'
            className="cancel"
          >
            Cancel
          </Button>
        </div>
      </form>
    </React.Suspense>
  );
}

export default Setting;
