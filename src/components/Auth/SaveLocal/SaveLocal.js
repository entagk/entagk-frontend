import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Loading from '../../../utils/Loading/Loading';

import './style.css';
import { initialSetting, modifySetting } from '../../../actions/timer';
import { addMultipleNotes } from '../../../actions/notes';
import { addMultipleTasks } from '../../../actions/tasks';

const Button = lazy(() => import('../../../utils/Button/Button'));
const ToggleButton = lazy(() => import('../../../utils/ToggleButton/ToggleButton'));

const SaveLocal = ({ setMessage }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [saveData, setSaveData] = useState({});
  const { setting } = useSelector(state => state.timer);
  const { tasks } = useSelector(state => state.tasks);
  const { notes } = useSelector(state => state.notes);

  useEffect(() => {
    console.log(saveData);
    console.log(tasks);
    console.log(notes);
    console.log(setting);
    if (tasks.length > 0)
      setSaveData((p) => ({ ...p, tasks: false }));

    console.log(saveData);
    console.log(tasks);
    console.log(notes);
    console.log(setting);
    if (notes.ids.length > 0)
      setSaveData((p) => ({ ...p, notes: false }));

    console.log(saveData);
    console.log(tasks);
    console.log(notes);
    console.log(setting);
    if (JSON.stringify(setting) !== JSON.stringify(initialSetting))
      setSaveData((p) => ({ ...p, timerSettings: false }));

    // eslint-disable-next-line
  }, []);

  const lables = {
    tasks: "Tasks",
    notes: "Notes",
    timerSettings: "Timer settings"
  }

  const handleSaveLocalData = () => {
    setIsLoading(true);
    console.log('SavaLocalData');
    console.log(saveData);
    if (JSON.stringify(setting) !== JSON.stringify(initialSetting) && saveData.timerSettings) {
      dispatch(modifySetting(setting, setMessage));
    }

    console.log(notes.ids);
    if (notes.ids.length > 0 && saveData.notes) {
      dispatch(addMultipleNotes(setMessage));
    }

    if (tasks.length > 0 && saveData.tasks) {
      dispatch(addMultipleTasks(tasks, setIsLoading, setMessage));
    }

    setIsLoading(false);
    navigate('/');
  }

  return (
    <Suspense fallback={
      <Loading
        size="verybig"
        backgroud="transperent"
        color="#ffffff"
        className="center-fullpage"
      />
    }>
      <div className='glass-container'>
        <div className='glass-effect save-local-popup'>
          <h2>Save local data</h2>
          <div className='sava-options'>
            {Object.keys(saveData).map((label) => (
              <div className='block'>
                <span>{lables[label]}</span>
                <ToggleButton data={saveData} type={label} setData={setSaveData} />
              </div>
            ))}
          </div>
          <div className='buttons'>
            <Button
              className='save'
              type='submit'
              aria-label='save local data'
              variant='contained'
              color="main"
              disabled={isLoading}
              onClick={handleSaveLocalData}
            >
              {
                isLoading ?
                  <Loading
                    size="small"
                    color={"#fff"}
                    backgroud="transparent"
                    style={{ margin: 0 }}
                  />
                  :
                  'Ok'
              }
            </Button>
            <Button
              type='button'
              aria-label='cancel form'
              onClick={() => navigate('/')}
              variant='outlined'
              className="cancel"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </Suspense>
  )
}

export default SaveLocal;
