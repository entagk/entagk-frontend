import React, { Suspense, lazy, useState } from 'react';

import { RiArrowDownSLine } from 'react-icons/ri';

import './style.css';

const Menu = lazy(() => import('../../../utils/Menu/Menu'));
const MenuItem = lazy(() => import('../../../utils/Menu/MenuItem'));

function Select({ options, setChange, type, data, setData, width }) {
  const realOptions = typeof options[0] === "object" ? options.map((op) => op.name) : options;
  const [openMenu, setOpenMenu] = useState(false);

  const handleChange = (e) => {
    setData({ ...data, [type]: options[Number(e.target.value)] });
    setChange(true);
    setOpenMenu(false);
  }

  return (
    <div className='select-container'>
      <div className='select-menu menu' style={{ width: width || '200px' }}>
        <Suspense fallback={<></>}>
          <Menu
            open={openMenu}
            setOpen={setOpenMenu}
            MainButton={
              <button
                type='button'
                aria-label='open menu'
                className='toggle-menu'
              >
                <span>{data[type]?.name || data[type]}</span>
                <RiArrowDownSLine className='arrow' />
              </button>
            }
            style={{ top: 35 }}
          >
            {realOptions?.map((option, index) => (
              <MenuItem
                key={index}
                aria-label={option}
                type='button'
                onClick={handleChange}
                value={index}
                className={data[type].name === option || data[type] === option ? "active" : null}
              >{option}</MenuItem>
            ))}
          </Menu>
        </Suspense>
      </div>
    </div>
  );
}

export default Select;
