import React, { lazy, useState } from 'react'

import './style.css'

import { BsBarChart, BsPieChart } from 'react-icons/bs';
import AnalyticsChart from './AnalyticsChart';

import { getMonthRange, getWeekStartAndEnd } from '../../../utils/helper';

const Button = lazy(() => import('../../../utils/Button/Button'));

const Analytics = ({ setMessage }) => {
  const [chart, setChart] = useState('bar');
  const dateTypes = ['day', 'week', 'month'];
  const [dateType, setDateType] = useState(dateTypes[0]);
  const [dataType, setDataType] = useState('tasks');
  const [date, setDate] = useState({ startDate: new Date().toJSON().split('T')[0], endDate: new Date().toJSON().split('T')[0], display: 'today' });
  const [chartData, setChartData] = useState([]);

  return (
    <div className='analytics'>
      <div className='header'>
        <h2>Analytics</h2>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div className='horizontal-bar'>
            <Button
              variant={chart === 'bar' ? "contained" : 'outlined'}
              startIcon={
                <BsBarChart />
              }
              onClick={() => setChart('bar')}
            >
            </Button>
            <Button
              variant={chart === 'pie' ? "contained" : 'outlined'}
              startIcon={
                <BsPieChart />
              }
              onClick={() => setChart('pie')}
              type="button"
            >
            </Button>
          </div>
        </div>
      </div>
      <div className='analytics-type'>
        <div className='horizontal-bar'>
          {dateTypes.map((item, index) => (
            <Button
              variant={dateType === item ? "contained" : 'outlined'}
              onClick={() => {
                setDateType(item)
                if (item === 'day') {
                  setDate({ startDate: 'today', endDate: 'today', display: 'today' })
                } else if (item === 'week') {
                  const [start, end] = getWeekStartAndEnd();
                  setDate({ startDate: start, endDate: end, display: 'this week' })
                } else {
                  const [start, end] = getMonthRange(new Date().getFullYear(), new Date().getMonth());
                  setDate({ startDate: start, endDate: end, display: 'this month' })
                }
              }}
              style={{ borderRight: index !== 2 ? '2px solid' : "none" }}
              type="button"
              key={index}
            >
              {item}
            </Button>
          ))}
        </div>
      </div>
      <AnalyticsChart
        dataType={dataType}
        setDataType={setDataType}
        dateType={dateType}
        setDateType={setDateType}
        setMessage={setMessage}
        date={date}
        setDate={setDate}
      />
    </div>
  )
}

export default Analytics;
