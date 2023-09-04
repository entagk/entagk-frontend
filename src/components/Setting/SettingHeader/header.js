import React from 'react';
import { CgClose } from 'react-icons/cg';
import { BsArrowLeft } from 'react-icons/bs';
import Button from '../../../utils/Button/Button';
import Header from '../../../utils/GlassEffectHeader/header';

function SettingHeader({
  linkClick,
  status,
  setStatus,
  formErrors,
  handleErrors
}) {
  const handleBack = () => {
    const errors = handleErrors();
    console.log(errors)

    if (errors.length === 0) {
      setStatus('');
    }
  }

  return (
    <Header
      title={status === '' ? 'Setting' : `${status} setting`}
      className='setting-header'
      showLeft={status !== ''}
      LeftButton={
        <Button
          aria-label='back'
          type='button'
          variant='single-icon'
          color="white"
          style={{ marginLeft: 0 }}
          onClick={handleBack}
          startIcon={
            <BsArrowLeft />
          }
          disabled={Object.values(formErrors).filter(fE => fE.length > 0).length > 0}
        />
      }
      RightButton={
        <Button
          aria-label='close setting'
          className="close"
          type='button'
          onClick={linkClick}
          variant='none'
          startIcon={
            <CgClose />
          }
        />
      }
    />
  );
}

export default SettingHeader;
