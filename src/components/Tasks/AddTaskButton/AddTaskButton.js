import React from 'react';

import Button from '../../../utils/Button/Button';
import { AiOutlinePlus } from 'react-icons/ai';

import './style.css';

function AddTaskButton({ setOpenFormForNew }) {
  return (
    <Button
      aria-label="add task button"
      className="add-task-button"
      onClick={() => setOpenFormForNew(p => !p)}
      variant="outlined"
      startIcon={
        <AiOutlinePlus size="25px" />
      }
    >
      add task
    </Button>
  );
}

export default AddTaskButton;
