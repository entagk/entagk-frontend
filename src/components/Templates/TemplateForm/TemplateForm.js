import React, { useState, lazy, Suspense } from 'react';

import { CgClose, CgTimelapse } from 'react-icons/cg';
import { AiOutlineInfo, AiFillSound } from 'react-icons/ai';

import './style.css'

const TodoList = lazy(() => import('../../../icons/list/TodoList'));

const InfoStep = lazy(() => import('./InfoStep/InfoStep'));
const TasksStep = lazy(() => import('./TasksStep/TasksStep'));
const TimerStep = lazy(() => import('./TimerStep/TimerStep'));
const SoundStep = lazy(() => import('./SoundStep/SoundStep'));

/*
  {
    "_id": "649a0d04948697c38349a936",
    "name": "New Template",
    // "visibility": false,
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Sed tempus tortor iaculis, interdum justo eget, dignissim nunc. Morbi sagittis, 
      felis quis vehicula dapibus, sapien ex imperdiet eros, a scelerisque nunc magna id nisl. 
      Fusce porttitor posuere erat. Vivamus efficitur sapien enim, vel fringilla mi semper sed. 
      Suspendisse facilisis felis sed est lobortis fermentum. Phasellus sit amet lobortis est. 
      Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.jdsj",
    "tasks": [
      "649a0d04948697c38349a938",
      "649a0d04948697c38349a939",
      "649a0d04948697c38349a93a"
    ],
    "userId": "64418d46391fa556399c6a0f",
    "est": 60,
    "act": 0,
    // "color": "#ef9b0f",
    // "usedBy": 1,
    "time": {
        "PERIOD": 1500,
        "SHORT": 300,
        "LONG": 900
    },
    // "timeForAll": true,
    "autoBreaks": false,
    "autoPomodors": false,
    "autoStartNextTask": false,
    "longInterval": 4,
    "alarmType": {
        "name": "alarm 1",
        "src": "sounds/alarm/1.mp3"
    },
    "alarmVolume": 50,
    "alarmRepet": 0,
    "tickingType": {
        "name": "tricking 1",
        "src": "sounds/tricking/1.mp3"
    },
    "tickingVolume": 50,
    "templateClone": "",
    "createdAt": "2023-06-26T22:11:16.230Z",
    "updatedAt": "2023-06-26T22:11:16.614Z",
    "__v": 0
}
 */

const initialData = {
  name: "",
  desc: "",
  tasks: [],
};

function TemplateForm({ oldData, isLoading, setIsLoading, setOpen }) {
  const [activeStep, setActiveStep] = useState(0);
  const [data, setData] = useState(oldData === null ? initialData : oldData);
  const [message, setMessage] = useState({ message: '', type: '' })

  const steps = [
    {
      text: 'info',
      Icon: () => <AiOutlineInfo />,
    },
    {
      text: 'todo',
      Icon: () => <TodoList />,
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
      setActiveStep(as => --as);
    }
  }

  const handleNextButton = (e) => {
    if (e.target.type === 'submit') {
      e.priventDefault();
    }
    console.log('next')
    if (activeStep < 3) {
      setActiveStep(as => ++as);
      debugger;
    }
  }

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  }

  const stepComponents = [
    <InfoStep
      data={data}
      setData={setData}
      handleChange={handleChange}
    />,
    <TasksStep
      data={data}
      setData={setData}
      handleChange={handleChange}
      message={message}
      setMessage={setMessage}
    />,
    <TimerStep
      data={data}
      setData={setData}
      handleChange={handleChange}
    />,
    <SoundStep
      data={data}
      setData={setData}
      handleChange={handleChange}
    />
  ]

  const handleSubmit = (e) => {
    e.priventDefault();
    console.log(e);
  }

  const disableNextOrSubmit = () => {
    switch (activeStep) {
      case 0:
        return !data.name || !data.desc;
      case 1:
        return true;
      case 2:
        return true;
      default:
        return true;
    }
  }

  return (
    <div className="glass-container">
      <div className="glass-effect temp-form">
        <div className='form-header'>
          <h2>{oldData ? 'edit template' : 'new template'}</h2>
          <button aria-label='close template form' className="close-temp-form" type='button' onClick={() => setOpen(false)}>
            <CgClose />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className='form-middle'>
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
            <Suspense fallback={<></>}>
              {stepComponents[activeStep]}
            </Suspense>
          </div>
          <div className='form-footer'>
            <button
              aria-label="cancel form button"
              type="button"
              onClick={handleCancelOrPrev}
            >
              {activeStep === 0 ? 'cancel' : 'previous'}
            </button>
            <button
              aria-label="next/submit form button"
              type={activeStep <= 2 ? "button" : "submit"}
              onClick={handleNextButton}
              className="save"
              disabled={disableNextOrSubmit()}
            >
              {activeStep === 3 ? 'save' : 'next'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TemplateForm;
