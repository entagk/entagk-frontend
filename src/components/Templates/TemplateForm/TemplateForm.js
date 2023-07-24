import React, { useState, lazy, Suspense } from 'react';

import { CgClose, CgTimelapse } from 'react-icons/cg';
import { AiOutlineInfo, AiFillSound } from 'react-icons/ai';

import './style.css'

import Message from '../../../utils/Message';
import NetworkError from '../../NetworkError/NetworkError';
import FormFooter from './FormFooter/FormFooter';
import { useDispatch } from 'react-redux';
import { addTemplate, modifyTemplate } from '../../../actions/templates';
import Loading from '../../../utils/Loading/Loading';

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
  const [message, setMessage] = useState({ message: '', type: '' })

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

  const handleNextButton = (e) => {
    console.log('next')
    if (activeStep < 3) {
      setActiveStep(as => ++as);
    }
  }

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
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

  const disableNextOrSubmit = () => {
    switch (activeStep) {
      case 0:
        return !data.name || !data.desc;
      case 1:
        return data.tasks?.length === 0;
      case 2:
        return Object.values(data.time).includes(0);
      case 3:
        return data.longInterval === 0;
      default:
        return false;
    }
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
            <button
              aria-label='close template form'
              className="close-temp-form"
              type='button'
              onClick={() => setOpen(false)}
            >
              <CgClose />
            </button>
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
                    data={data}
                    setData={setData}
                    handleChange={handleChange}
                  />
                  <FormFooter
                    disableNextOrSubmit={disableNextOrSubmit}
                    handleCancelOrPrev={handleCancelOrPrev}
                    handleNextButton={handleNextButton}
                    activeStep={activeStep}
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
                    data={data}
                    setData={setData}
                    handleChange={handleChange}
                  />
                ) :
                  activeStep === 1 ? (
                    <TasksStep
                      data={data}
                      setData={setData}
                      handleChange={handleChange}
                      message={message}
                      setMessage={setMessage}
                    />
                  ) : (
                    <TimerStep
                      data={data}
                      setData={setData}
                      handleChange={handleChange}
                    />
                  )
                }
              </Suspense>
              <FormFooter
                disableNextOrSubmit={disableNextOrSubmit}
                handleCancelOrPrev={handleCancelOrPrev}
                handleNextButton={handleNextButton}
                activeStep={activeStep}
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
