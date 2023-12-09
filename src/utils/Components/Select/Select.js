import React, { Suspense, lazy, useState } from 'react';

import { RiArrowDownSLine } from 'react-icons/ri';

import './style.css';

import Loading from '../../../utils/Components/Loading/Loading';
import Button from '../../../utils/Components/Button/Button';

const Menu = lazy(() => import('../../../utils/Components/Menu/Menu'));

function Select({
  options,
  setChange,
  type,
  data,
  setData,
  width,
  displayType,
  menuTop
}) {
  const realOptions = typeof options?.[0] === "object" ? options.map((op) => (op?.name || op?.text)) : options;
  const [openMenu, setOpenMenu] = useState(false);

  const handleChange = (optionIndex) => {
    setData({ ...data, [type]: options[optionIndex] });
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
                startIcon={
                  displayType === 'icon' && String.fromCodePoint(parseInt((data[type]?.icon || data[type].code), 16))
                }
                endIcon={
                  <RiArrowDownSLine className='arrow' />
                }
                variant='outlined'
              >
                {displayType !== 'icon' && (data[type]?.name || data[type])}
              </Button>
            }
            style={{ top: menuTop || 35 }}
          >
            {realOptions?.map((option, index) => (
              <Button
                key={index}
                aria-label={option}
                type='button'
                onClick={() => handleChange(index)}
                className={data[type].name === option || data[type] === option ? "active" : null}
                variant='none'
                startIcon={
                  displayType === 'icon' && String.fromCodePoint(parseInt((options[index].icon || options[index].code), 16))
                }
              >
                {option}
              </Button>
            ))}
          </Menu>
        </Suspense>
      </div>
    </div>
  );
}

export default Select;
