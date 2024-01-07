import React, {
  useEffect,
  // useEffect, 
  useState
} from 'react';

import { RiExternalLinkLine } from "react-icons/ri";
import { CgInternal } from "react-icons/cg";
import Button from '../../../utils/Components/Button/Button';

function SmallWinBtn() {
  const [minWin, setMinWin] = useState(localStorage.getItem('opened') === 'popup');

  // useEffect(() => {
  //   if ((window.opener === null || window?.opener?.closed) && window.name === 'popup') {
  //     window.opener.postMessage("opened", window.origin);
  //     localStorage.removeItem("opened");
  //     console.log(window.opener)
  //     window.open(window.location, "_blank");
  //     window.close();
  //   } else {
  //     if (window.name !== 'popub') {
  //       window.close();
  //     }
  //   }
  //   // eslint-disble-next-line
  // }, []);

  const handleOpenExtInt = (event) => {
    if ('open' in window) {
      if (window.opener === null || window?.opener?.closed) {
        window.open("/", "popup", "left=100,top=100,height=332,width=356");
      } /*else {
        if (window.opener !== null) {
          window.opener.postMessage("close", window.origin);
          if (window.name === 'popup') {
            window.postMessage("close", window.origin);
            window.close();
          }
          else window.opener.close();
          localStorage.removeItem("opened");

        }
      }*/
    }
  }

  window.onmessage = (event) => {
    if (window.origin === event.origin) {
      // if (window.name !== 'popup' && event.source.name === 'popup') {
      if (event.data === 'opened') {
        console.log(event.source.name);
        console.log(event.data);
        console.log(event.data);
        setMinWin(true);
      } else if (event.data === 'close') {
        localStorage.removeItem("opened")
        setMinWin(false);
      }

    }
  }

  useEffect(() => {
    const handleKeys = (event) => {
      const inputsItems = ['input', 'textarea', 'textbox'];
      const activeElement = document.activeElement.tagName.toLowerCase();
      if (inputsItems.findIndex(item => item === activeElement || item === event.target.role) === -1) {
        if (event.code.toLowerCase() === 'keye') {
          handleOpenExtInt();
        }
      }
    }

    window.addEventListener('keydown', handleKeys);

    return () => {
      window.removeEventListener('keydown', handleKeys);
    }
  })

  if ('open' in window === false) {
    return;
  }

  return (
    <>
      <Button
        aria-label='small external window'
        className='timer-button'
        type="button"
        onClick={handleOpenExtInt}
        color='main'
        variant='single-icon'
        startIcon={
          <>
            {(!minWin) ?
              <RiExternalLinkLine />
              : <>
                <CgInternal />
              </>
            }
          </>
        }
      />
    </>
  );
}

export default SmallWinBtn;
