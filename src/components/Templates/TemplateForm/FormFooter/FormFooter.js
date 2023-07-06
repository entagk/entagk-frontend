import React from 'react';

function FormFooter({activeStep, handleCancelOrPrev, handleNextButton, disableNextOrSubmit}) {
  return (
    <div className='form-footer'>
      <button
        aria-label="cancel form button"
        type="button"
        onClick={handleCancelOrPrev}
      >
        {activeStep === 0 ? 'cancel' : 'previous'}
      </button>
      <button
        aria-label="next/submit form button"
        type={activeStep <= 2 ? "button" : "submit"}
        onClick={handleNextButton}
        className="save"
        disabled={disableNextOrSubmit()}
      >
        {activeStep === 3 ? 'save' : 'next'}
      </button>
    </div>
  );
}

export default FormFooter;
