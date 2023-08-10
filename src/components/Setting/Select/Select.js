import React, { Suspense, lazy, useState } from 'react';

import { RiArrowDownSLine } from 'react-icons/ri';

import './style.css';

import Loading from '../../../utils/Loading/Loading';
import Button from '../../../utils/Button/Button';

const Menu = lazy(() => import('../../../utils/Menu/Menu'));

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
        <Suspense fallback={
          <Loading
            size="small"
            color={"#fff"}
            backgroud="transparent"
            paddingBlock='0'
          />
        }>
          <Menu
            open={openMenu}
            setOpen={setOpenMenu}
            MainButton={
              <Button
                type='button'
                aria-label='open menu'
                className='toggle-menu'
                endIcon={
                  <RiArrowDownSLine className='arrow' />
                }
                variant='outlined'
              >
                {data[type]?.name || data[type]}
              </Button>
            }
            style={{ top: 35 }}
          >
            {realOptions?.map((option, index) => (
              <button
                key={index}
                aria-label={option}
                type='button'
                onClick={handleChange}
                value={index}
                className={data[type].name === option || data[type] === option ? "active" : null}
                variant='none'
              >{option}</button>
            ))}
          </Menu>
        </Suspense>
      </div>
    </div>
  );
}

export default Select;
