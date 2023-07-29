import React from 'react';
import { CgClose } from 'react-icons/cg';
import { BsArrowLeft } from 'react-icons/bs';
import Button from '../../../utils/Button/Button';

function Header({ linkClick, status, setStatus }) {
  return (
    <div className='setting-header'>
      {status !== '' && (
        <Button
          aria-label='close setting'
          className="close-setting"
          type='button'
          variant='single-icon'
          color="white"
          style={{ marginLeft: 0 }}
          onClick={() => setStatus('')}
          startIcon={
            <BsArrowLeft />
          }
        />
      )}
      <h2>{status === '' ? 'Setting' : `${status} setting`}</h2>
      <Button
        aria-label='close setting'
        className="close-setting"
        type='button'
        onClick={linkClick}
        variant='none'
        startIcon={
          <CgClose />
        }
      />
    </div>
  );
}

export default Header;
