import React, { useCallback, useState, useEffect } from 'react';
import { RiFullscreenFill, RiFullscreenExitFill } from 'react-icons/ri';
import Button from '../../../utils/Button/Button';

const FullscreenBtn = () => {
  const [full, setFull] = useState(false);

  const handleFull = useCallback(() => {
    setFull((f) => !f);

    if (!full) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, [full]);

  useEffect(() => {
    window.onkeydown = (event) => {
      const inputsItems = ['input', 'textarea'];
      const activeElement = document.activeElement.tagName.toLowerCase();
      if (inputsItems.findIndex(item => item === activeElement || item === event.target.role) === -1) {
        if (event.code.toLowerCase() === 'keyf') {
          handleFull();
        }
      }
    }
  })

  return (
    <Button
      aria-label='full screen'
      className='timer-button'
      type="button"
      onClick={handleFull}
      style={{ left: '65px' }}
      color='main'
      variant='single-icon'
      startIcon={
        <>
          {(!full) ?
            <RiFullscreenFill />
            : <>
              <RiFullscreenExitFill />
            </>
          }
        </>
      }
    />
  );
};

export default FullscreenBtn;
