import React, { useState } from 'react';

import { RiArrowUpSLine, RiArrowDownSLine } from 'react-icons/ri';

function Select({ options, type, data, setData }) {
  const [open, setOpen] = useState(false);
  const realOptions = typeof options[0] === "object" ? options.map((op) => op.name) : options;

  const handleChange = (e) => {
    setData({ ...data, [type]: options[Number(e.target.value)] });
  }

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      width: "fit-content"
    }}>
      <div className='select-menu menu' style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        flexDirection: "column",
        position: "relative"
      }}>
        <button type='button' aria-label='open menu' className='open-menu' onClick={() => setOpen(!open)}><p>{data[type]?.name || data[type]}</p>{open ? (<RiArrowUpSLine className='arrow' />) : (<RiArrowDownSLine className='arrow' />)}</button>
        {open && (
          <div className='menu-content' style={{ width: "max-content", top: 35 }}>
            <div className='row' style={{ width: "100%" }}>
              {realOptions?.map((option, index) => (
                <button key={index} type='button' onClick={handleChange} value={index} className={data[type].name === option || data[type] === option ? "active" : null}>{option}</button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Select;