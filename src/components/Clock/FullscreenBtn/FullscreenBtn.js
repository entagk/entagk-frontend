import React, { useCallback, useState, useEffect } from 'react';
import { RiFullscreenFill, RiFullscreenExitFill } from 'react-icons/ri';

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
      if(event.code.toLowerCase() === 'keyf') {
        handleFull();
      }
    }
  })

  return (
    <button aria-label='full screen' className='timer-button' type="button" onClick={handleFull} style={{ left: '65px' }}>
      {(!full) ?
        <RiFullscreenFill />
        : <>
          <RiFullscreenExitFill />
        </>
      }
    </button>
  );
};

export default FullscreenBtn;
