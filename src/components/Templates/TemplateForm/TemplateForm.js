import React, { useState, lazy, Suspense, useEffect } from 'react';

import { CgClose, CgTimelapse } from 'react-icons/cg';
import { AiOutlineInfo, AiFillSound } from 'react-icons/ai';

import './style.css'

import Message from '../../../utils/Message';
import NetworkError from '../../NetworkError/NetworkError';
import FormFooter from './FormFooter/FormFooter';
import { useDispatch } from 'react-redux';
import { addTemplate, modifyTemplate } from '../../../actions/templates';
import Loading from '../../../utils/Loading/Loading';
import Button from '../../../utils/Button/Button';

const TodoList = lazy(() => import('../../../icons/list/TodoList'));
const InfoStep = lazy(() => import('./InfoStep/InfoStep'));
const TasksStep = lazy(() => import('./TasksStep/TasksStep'));
const TimerStep = lazy(() => import('./TimerStep/TimerStep'));
const SoundStep = lazy(() => import('./SoundStep/SoundStep'));
const CompletedStatus = lazy(() => import('./CompletedStatus/CompletedStatus'));

const initialData = {
  name: "",
  desc: "",
  tasks: [],
  time: {
    "PERIOD": 1500,
    "SHORT": 300,
    "LONG": 900,
  },
  autoBreaks: false,
  autoPomodors: false,
  autoStartNextTask: false,
  longInterval: 4,
  alarmType: {
    "name": "alarm 1",
    "src": "sounds/alarm/1.mp3"
  },
  alarmVolume: 50,
  alarmRepet: 0,
  tickingType: {
    "name": "tricking 1",
    "src": "sounds/tricking/1.mp3"
  },
  tickingVolume: 50,
};

function TemplateForm({
  oldData,
  isLoading,
  setIsLoading,
  setOpen
}) {
  const dispatch = useDispatch();
  const [activeStep, setActiveStep] = useState(0);
  const [data, setData] = useState(oldData === null ? initialData : oldData);
  const [message, setMessage] = useState({ message: '', type: '' });
  const [required, setRequired] = useState(["name", "desc"]);
  const [formErrors, setFormErrors] = useState({});
  const [validations, setValidations] = useState({
    name: (v) => {
      setFormErrors(pFE => (
        {
          ...pFE,
          name: v.trim().length === 0 ?
            "This field is required" :
            v.trim().length > 50 ? "The name length is more than 50 characters." : ""
        }));
      return v.trim().length === 0 || v.trim().length > 50
    },
    desc: (v) => {
      setFormErrors(pFE => (
        {
          ...pFE,
          desc: v.trim().length === 0 ?
            "This field is required" :
            v.trim().length > 500 ?
              "The description length is more than 500 characters." :
              ""
        }
      ))
      return v.trim().length > 500 || v.trim().length === 0;
    }
  });

  useEffect(() => {
    if (activeStep === 0) {
      setRequired(['name', 'desc']);
    } else if (activeStep === 2) {
      setFormErrors((pFE) => ({
        ...pFE,
        time: {
          "LONG": "",
          "PERIOD": "",
          "SHORT": "",
        }
      }));
      setRequired([["LONG", "PERIOD", "SHORT"], "longInterval"]);
      ["LONG", "PERIOD", "SHORT"].forEach(t => {
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
          },
        }));
      });
      setValidations((pV) => ({
        ...pV,
        "longInterval": (pLI) => {
          setFormErrors(pFE => ({
            ...pFE,
            "longInterval":
              pLI < 2 ?
                "The long interval must be more than 2" :
                ""
          }))
          return pLI < 2;
        },
      }));
    } else if (activeStep === 3) {
      setRequired(["alarmRepet"]);
      setValidations((pV) => ({
        ...pV,
        'alarmRepet': (ar) => {
          setFormErrors(pFE => ({
            ...pFE,
            'alarmRepet': ar < 0 || ar > 60 ?
              "Alarm repet should be in range 0-60 seconds" :
              ""
          }))
          return ar < 0 || ar > 60;
        }
      }));
    }

    // eslint-disable-next-line
  }, [activeStep])

  const steps = [
    {
      text: 'info',
      Icon: () => <AiOutlineInfo />,
    },
    {
      text: 'todo',
      Icon: () => <Suspense fallback={<></>}><TodoList /></Suspense>,
    },
    {
      text: 'timer',
      Icon: () => <CgTimelapse />,
    },
    {
      text: 'sound',
      Icon: () => <AiFillSound />,
    },
  ];

  const handleCancelOrPrev = () => {
    if (activeStep === 0) {
      setOpen(false);
    } else {
      setActiveStep(as => as - 1);
    }
  }

  const handleErrors = () => {
    const errors = Object.entries(formErrors).filter(([k, v]) => v.length > 0);
    required.forEach((f) => {
      if (!Array.isArray(f)) {
        if (validations?.[f]?.(data[f])) {
          errors.push([f])
        };
      } else {
        f.forEach(t => {
          if (validations?.time?.[t]?.(data.time[t])) {
            errors.push([f]);
          };
        })
      }
    })

    return errors;
  }

  const handleNextButton = (e) => {
    console.log('next')
    const errors = handleErrors();

    if (errors.length === 0) {
      if (activeStep < 3) {
        setActiveStep(as => ++as);
      }
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });

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
      console.log(validations[name](value));
    } else {
      validations[name](value);
      console.log(validations[name](value))
    }
  }


  const handleSubmit = (e) => {
    e.preventDefault();

    if (!data.name) {
      setMessage("Empty name");
    } else if (!data.desc) {
      setMessage("Empty desc");
    } else if (data.tasks.length === 0) {
      setMessage("Empty todo list");
    } else if (Object.values(data.time).includes(0)) {
      setMessage({ message: "Please enter valid time data", type: 'error' });
    } else if (!data.longInterval) {
      setMessage({ message: "Please enter long break interval", type: 'error' });
    } else {
      if (!oldData) {
        dispatch(addTemplate(data, setIsLoading, setActiveStep, setMessage));
      } else {
        if (oldData !== data) {
          dispatch(modifyTemplate(data._id, {
            ...data,
            tasks: data.tasks.map(t => t._id)
          },
            setIsLoading,
            setActiveStep,
            setMessage
          ));
        }
      }

      setActiveStep(as => ++as);
    }
  }

  const requiredForEveryStatus = {
    data,
    setData,
    handleChange,
    handleBlur,
    formErrors,
    setFormErrors,
    validations,
  }

  const requiedForFooter = {
    formErrors,
    handleCancelOrPrev,
    handleNextButton,
    activeStep,
    data,
  }

  return (
    <>
      {(message.message && !message.message.includes('Network Error')) ? (
        <Message {...message} setMessage={setMessage} />
      ) : message.message.includes('Network Error') && (
        <NetworkError />
      )}
      <div className="glass-container">
        <div className="glass-effect temp-form">
          <div className='form-header'>
            <h2>{oldData ? 'edit template' : 'new template'}</h2>
            <Button
              aria-label='close template form'
              className="close-temp-form"
              type='button'
              onClick={() => setOpen(false)}
              startIcon={
                <CgClose />
              }
            />
          </div>
          <div className='steps'>
            {steps.map((step, index) => (
              <div key={index} className={`step ${index === activeStep ? 'active' : index < activeStep && 'completed'}`}>
                <div className='icon'>{<step.Icon />}</div>
                <p className='text'>{step.text}</p>
                {index !== 3 && (
                  <div className="line"></div>
                )}
              </div>
            ))}
          </div>
          {(activeStep === 3) ? (
            <form onSubmit={handleSubmit}>
              <div className='form-middle'>
                <Suspense fallback={
                  <Loading
                    size="big"
                    backgroud="transparant"
                    color="white"
                  />
                }>
                  <SoundStep
                    {...requiredForEveryStatus}
                  />
                  <FormFooter
                    {...requiedForFooter}
                  />
                </Suspense>
              </div>
            </form>
          ) : activeStep < 3 ? (
            <div className='form-middle'>
              <Suspense fallback={
                <Loading
                  size="big"
                  backgroud="transparant"
                  color="white"
                />
              }>
                {activeStep === 0 ? (
                  <InfoStep
                    {...requiredForEveryStatus}
                  />
                ) :
                  activeStep === 1 ? (
                    <TasksStep
                      {...requiredForEveryStatus}
                      message={message}
                      setMessage={setMessage}
                    />
                  ) : (
                    <TimerStep
                      {...requiredForEveryStatus}
                    />
                  )
                }
              </Suspense>
              <FormFooter
                {...requiedForFooter}
              />
            </div>
          ) : (
            <>
              <Suspense fallback={
                <Loading
                  size="big"
                  backgroud="transparant"
                  color="white"
                />
              }>
                <CompletedStatus
                  data={data}
                  setIsLoading={setIsLoading}
                  isLoading={isLoading}
                  setOpen={setOpen}
                />
              </Suspense>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default TemplateForm;
