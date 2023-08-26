import React, { Suspense, lazy, useState } from 'react';

import { RiArrowDownSLine } from 'react-icons/ri';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import { getMonthRange, getWeekStartAndEnd } from '../../../utils/helper';
import Loading from '../../../utils/Loading/Loading';

const Menu = lazy(() => import('../../../utils/Menu/Menu'));
const Button = lazy(() => import('../../../utils/Button/Button'));

const DateAndData = ({ dataType, setDataType, dateType, setDateType, date, setDate }) => {
  const [openMenu, setOpenMenu] = useState(false);
  const dataTypes = ["tasks", "templates", "types"];

  const goBackOrNext = (type) => {
    if (dateType === 'day') {
      const newDate = date.startDate === 'today' ? new Date() : new Date(date.startDate);
      newDate.setDate(type === 'back' ? newDate.getDate() - 1 : newDate.getDate() + 1);
      const newDateJSON = newDate.toJSON()?.split('T')[0];

      const todayDate = new Date().toJSON().split('T')[0];
      setDate({
        startDate: todayDate === newDateJSON ? 'today' : newDateJSON,
        endDate: todayDate === newDateJSON ? 'today' : newDateJSON,
        display: todayDate === newDateJSON ? 'today' : newDateJSON
      });
    } else if (dateType === 'week') {
      const current = type === 'back' ? new Date(date.startDate) : new Date(date.endDate);

      if (type === 'back') {
        current.setDate(current.getDate() - 2)
      } else {
        current.setDate(current.getDate() + 2)
      }

      const [start, end] = getWeekStartAndEnd(current);

      const todayDate = new Date();

      setDate({
        startDate: start,
        endDate: end,
        display: new Date(end) - todayDate > 0 ?
          'this week' :
          start.replaceAll('-', '/') + " - " + end.replaceAll('-', '/')
      });
    } else {
      const current =
        date.display === 'this month' ?
          new Date() :
          new Date(date.display);

      current.setMonth(type === 'back' ? current.getMonth() - 1 : current.getMonth() + 1);

      const [start, end] = getMonthRange(
        current.getFullYear(),
        current.getMonth()
      );

      const todayDate = new Date();

      setDate({
        startDate: start,
        endDate: end,
        display: new Date(end) - todayDate > 0 ?
          'this month' :
          current.toLocaleString('default', { month: 'long', year: 'numeric' })
      });
    }
  }

  return (
    <div className='date-data'>
      <div className='date'>
        {!date.display.includes('this') && date.display !== 'today' && (
          <Button
            aria-label='next arrow button'
            style={{
              marginInline: "0 8px"
            }}
            startIcon={
              <MdKeyboardArrowLeft />
            }
            onClick={() => goBackOrNext('next')}
            variant='single-icon'
          />
        )}
        <p
          style={{
            fontSize: '22px',
            textTransform: 'capitalize',
          }}
        >
          {
            date.startDate === date.endDate ? date.display?.replaceAll('-', '/') : date.display
          }
        </p>
        <Button
          aria-label='back arrow button'
          onClick={() => goBackOrNext('back')}
          startIcon={
            <MdKeyboardArrowRight />
          }
          variant='single-icon'
        />
      </div>
      {(dateType === 'day' || dateType === 'week') && (
        <div className='data-type'>
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
                  endIcon={
                    <RiArrowDownSLine className='arrow' />
                  }
                  style={{
                    borderRadius: "10px",
                    textTransform: "capitalize"
                  }}
                >
                  {dataType}
                </Button>
              }
            >
              {dataTypes.map((item, index) => (
                <Button
                  key={index}
                  aria-label={item}
                  type='button'
                  onClick={() => setDataType(item)}
                  value={index}
                  variant='none'
                  style={{
                    textTransform: "capitalize",
                    background: item === dataType && "var(--main-light-black)"
                  }}
                >
                  {item}
                </Button>
              ))}
            </Menu>
          </Suspense>
        </div>
      )}
    </div>
  )
}

export default DateAndData;
