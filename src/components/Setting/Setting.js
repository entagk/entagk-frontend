import React, { useState, useEffect, lazy } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSetting, modifySetting } from '../../actions/timer';

import Loading from '../../utils/Components/Loading/Loading';

import "./style.css";

const Button = lazy(() => import('../../utils/Components/Button/Button'));

const SettingHeader = lazy(() => import('./SettingHeader/header'));
const SettingMenu = lazy(() => import('./SettingMenu'));
const TimerSetting = lazy(() => import('./TimerSetting/TimerSetting'));
const SoundSetting = lazy(() => import('./SoundSetting/SoundSetting'));
const NotificationSetting = lazy(() => import('./NotificationSetting/NotificationSetting'));
const FocusSetting = lazy(() => import('./FocusSetting/FocusSetting'));

function Setting({ setOpenSetting, setMessage }) {
  const { originalSetting, isLoading } = useSelector(state => state.timer);

  const [data, setData] = useState(originalSetting);
  const [status, setStatus] = useState('');
  const dispatch = useDispatch();
  const [required, setRequired] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [validations, setValidations] = useState({});
  const timerRequired = [["LONG", "PERIOD", "SHORT"], "longInterval"];

  useEffect(() => {
    if (status === 'timer') {
      setFormErrors((pFE) => ({
        ...pFE,
        time: {
          "LONG": "",
          "PRIOD": "",
          "SHORT": ""
        }
      }))
      setRequired(timerRequired);
      timerRequired[0].forEach((t) => {
        setValidations((pV) => ({
          ...pV,
          time: {
            ...pV?.time,
            [t]: (tL) => {
              setFormErrors(pFE => ({
                ...pFE,
                time: {
                  ...pFE?.time,
                  [t]: tL < 1 || tL > 3600 ?
                    'invalid time' :
                    ""
                }
              }))
              return tL < 1 || tL > 3600;
            },
          }
        }));
      });
      setValidations((pV) => ({
        ...pV,
        [timerRequired[1]]: (pLI) => {
          setFormErrors(pFE => ({ ...pFE, [timerRequired[1]]: pLI < 2 ? "The long interval must be more than 2" : "" }))
          return pLI < 2;
        }
      }));
    } else if (status === 'sounds') {
      setRequired(["alarmRepet"])
      setValidations((pV) => ({
        ...pV,
        'alarmRepet': (ar) => {
          setFormErrors(pFE => ({ ...pFE, 'alarmRepet': ar < 0 || ar > 60 ? "Alarm repet should be in range 0-60 seconds" : "" }))
          return ar < 0 || ar > 60;
        }
      }));
    } else if (status === 'notifications') {
      setRequired(["notificationInterval"])
      setValidations((pV) => ({
        ...pV,
        'notificationInterval': (nI) => {
          setFormErrors(pFE => ({
            ...pFE,
            'notificationInterval': nI < 1 || nI > 60 ?
              "Invalid notification interval between 1 and 60" : ""
          }))
          return nI < 1;
        }
      }));
    } else {
      setRequired([]);
    }

    // eslint-disable-next-line
  }, [status]);

  useEffect(() => {
    if (originalSetting === undefined && !isLoading) {
      dispatch(getSetting(setMessage));
    }
    setData(originalSetting);
    // eslint-disable-next-line
  }, [originalSetting, isLoading]);

  if (originalSetting === undefined) {
    return (
      <div className="glass-effect setting-loader">
        <div className='header'>
          <h2>loading setting...</h2>
        </div>
        <Loading
          size="big"
          color="#ffffff"
          backgroud="transperent"
        />
      </div>
    )
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: Number(value) });

    if (
      value !== ''
    ) {
      setFormErrors(fep => ({ ...fep, [name]: '' }));
    }
  }

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (value === '' && required.includes(name)) {
      setFormErrors(fep => ({ ...fep, [name]: 'This field is required' }));
    } else {
      validations[name](value);
    }
  }

  const handleErrors = () => {
    const errors = Object.entries(formErrors).filter(([k, v]) => v.length > 0);

    required.forEach((f) => {
      if (f instanceof Array) {
        f.forEach(t => {
          if (validations.time[t](data.time[t])) {
            errors.push([f]);
          };
        })
      } else {
        if (validations[f](data[f])) {
          errors.push([f])
        };
      }
    })

    return errors;
  }

  const handleSubmit = async (e) => {
    await e.preventDefault();

    console.log(data);

    const errors = handleErrors();

    const dataSent = { ...data };

    Object.entries(data).forEach(([key, value]) => {
      if (data[key] === originalSetting[key]) {
        delete dataSent[key];
      } else {
        console.log(key, value);
      }
    });

    if (Object.entries(dataSent).length !== 0 && errors.length === 0) {
      await dispatch(modifySetting(dataSent, setMessage, setFormErrors));
    }

    setOpenSetting(false);
  }

  const requiredForEveryStatus = {
    data,
    setData,
    handleChange,
    handleBlur,
    formErrors,
    setFormErrors,
    validations,
    setMessage,
  }

  return (
    <React.Suspense fallback={
      <div className="glass-effect setting-loader">
        <div className='header'>
          <h2>loading setting...</h2>
        </div>
        <Loading
          size="big"
          color="#ffffff"
          backgroud="transparant"
        />
      </div>
    }>
      <form className='glass-effect setting' onSubmit={handleSubmit} >
        {(originalSetting && isLoading) && (
          <Loading
            size="big"
            color={"var(--main-color)"}
            backgroud="transparant"
            style={{
              background: "#ffffff73",
              margin: 0,
            }}
            className="center-fullpage"
          />
        )}
        <SettingHeader
          linkClick={handleSubmit}
          status={status}
          setStatus={setStatus}
          formErrors={formErrors}
          handleErrors={handleErrors}
        />
        <>
          {status === '' ? (
            <>
              <SettingMenu setStatus={setStatus} />
            </>
          ) : status === 'timer' ? (
            <>
              <TimerSetting
                {...requiredForEveryStatus}
              />
            </>
          ) : status === 'sounds' ? (
            <>
              <SoundSetting
                {...requiredForEveryStatus}
              />
            </>
          ) : (status === 'notifications' && "Notification" in window) ? (
            <>
              <NotificationSetting
                {...requiredForEveryStatus}
              />
            </>
          ) : (
            <>
              <FocusSetting
                data={data}
                setData={setData}
                handleChange={handleChange}
              />
            </>
          )}
        </>
        <div className='footer'>
          <Button
            className='save'
            type='submit'
            aria-label='submit form'
            disabled={Object.values(formErrors).filter(fE => fE.length > 0).length > 0}
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
