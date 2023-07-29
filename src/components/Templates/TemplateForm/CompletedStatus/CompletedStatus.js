import React from 'react';

// import { GrFormCheckmark } from 'react-icons/gr';

import { FaCheck } from 'react-icons/fa'
import './style.css';
import Loading from '../../../../utils/Loading/Loading';
import Button from '../../../../utils/Button/Button';

function CompletedStatus({ data, isLoading, setOpen }) {
  if (isLoading) {
    return (
      <div className='completed-status'>
        <Loading
          size="100"
          strokeWidth="3.5"
          backgroud="white"
          color={"var(--main-color)"}
        />
      </div>
    )
  }

  return (
    <div className='completed-status'>
      <div className='icon'>
        <FaCheck color='lime' />
      </div>
      <h3>Success</h3>
      <p>
        {data?._id ? (
          <>
            The <strong>{data?.name}</strong> template has been edited successfully.
          </>
        ) : (
          <>
            A new template has been added successfully.
          </>
        )}
      </p>
      <div>
        <Button
          aria-label='close popup'
          className='close'
          onClick={() => setOpen(false)}
          variant='contained'
          color="main"
        >
          Close
        </Button>
      </div>
    </div>
  );
}

export default CompletedStatus;
