import React from 'react';

import { CgClose } from 'react-icons/cg';

function TemplateTasksHeader({template, setOpenTodo}) {
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
          <h2 style={{
            marginLeft: "10px",
          }}>
            {template?.name + " Tasks"}
          </h2>
        </div>
        <button aria-label='close tasks' className="close-temp-tasks" type='button' onClick={() => setOpenTodo("")}>
          <CgClose />
        </button>
      </div>
    </>
  );
}

export default TemplateTasksHeader;
