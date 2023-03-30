import React from 'react';
import { CgClose } from 'react-icons/cg';
import { BsArrowLeft } from 'react-icons/bs';

function Header({ linkClick, status, setStatus }) {
  return (
    <div className='setting-header'>
      {status !== '' && (
        <button aria-label='close setting' className="close-setting" type='button' onClick={() => setStatus('')}>
          <BsArrowLeft />
        </button>
      )}
      <h2>{status === '' ? 'Setting' : `${status} setting`}</h2>
      <button aria-label='close setting' className="close-setting" type='button' onClick={linkClick}>
        <CgClose />
      </button>
    </div>
  );
}

export default Header;
