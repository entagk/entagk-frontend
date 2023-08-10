import React from 'react';

import { CgClose } from 'react-icons/cg';
import Button from '../../../utils/Button/Button';

function TemplateTasksHeader({ template, setOpenTodo }) {
  return (
    <>
      <div className="header">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'nowrap',
          flexDirection: 'row',
        }}>
          <h2>
            {template?.name + " Tasks"}
          </h2>
        </div>
        <Button
          aria-label='close tasks'
          className="close-temp-tasks"
          type='button'
          onClick={() => setOpenTodo("")}
          variant='none'
        >
          <CgClose />
        </Button>
      </div>
    </>
  );
}

export default TemplateTasksHeader;
