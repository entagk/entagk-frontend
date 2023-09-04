import React from 'react';

import { CgClose } from 'react-icons/cg';
import Button from '../../../utils/Button/Button';
import Header from '../../../utils/GlassEffectHeader/header';

function TemplateTasksHeader({ template, setOpenTodo }) {
  return (
    <>
      <Header
        title={template?.name + " Tasks"}
        RightButton={
          <Button
            aria-label='close tasks'
            className="close-temp-tasks"
            type='button'
            onClick={() => setOpenTodo("")}
            variant='none'
            startIcon={
              <CgClose />
            }
          />
        }
      />
    </>
  );
}

export default TemplateTasksHeader;
