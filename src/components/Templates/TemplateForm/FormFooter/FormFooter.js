import React from 'react';
import Button from '../../../../utils/Button/Button';

function FormFooter({
  activeStep,
  handleCancelOrPrev,
  handleNextButton,
  formErrors,
  data,
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
        disabled={
          activeStep === 1 ?
            data?.tasks?.length === 0 :
            Object.values(formErrors).filter(fE => fE.length > 0).length > 0
        }
        variant='contained'
        color="main"
      >
        {activeStep === 3 ? 'Save' : 'Next'}
      </Button>
    </div>
  );
}

export default FormFooter;
