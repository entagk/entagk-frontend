import React from 'react';
import Button from '../../../../utils/Button/Button';

function FormFooter({
  activeStep,
  handleCancelOrPrev,
  handleNextButton,
  disableNextOrSubmit
}) {
  return (
    <div className='form-footer'>
      <Button
        aria-label="cancel form button"
        type="button"
        onClick={handleCancelOrPrev}
        variant='outlined'
      >
        {activeStep === 0 ? 'Cancel' : 'Previous'}
      </Button>
      <Button
        aria-label="next/submit form button"
        type={activeStep <= 2 ? "button" : "submit"}
        onClick={handleNextButton}
        className="save"
        disabled={disableNextOrSubmit()}
        variant='contained'
        color="main"
      >
        {activeStep === 3 ? 'Save' : 'Next'}
      </Button>
    </div>
  );
}

export default FormFooter;
