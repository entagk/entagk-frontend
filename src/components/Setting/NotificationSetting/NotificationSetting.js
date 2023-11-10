import React, { Suspense, lazy } from 'react';

import Loading from '../../../utils/Components/Loading/Loading';

const Select = lazy(() => import('../../../utils/Components/Select/Select'));

const NotificationSetting = ({ data, setData, handleChange, formErrors, handleBlur }) => {
  return (
    <div className='block notification' style={{ border: "none" }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <h3>Notification</h3>
        <div className='notification-data'>
          <Suspense fallback={
            <Loading
              size="small"
              color={"#fff"}
              backgroud="transparent"
              paddingBlock='0'
            />
          }>
            <Select
              options={["every", "last"]}
              data={data}
              type="notificationType"
              setData={setData}
              width="100px"
              setChange={() => { }}
            />
          </Suspense>
          <div className='notification-min'>
            <input
              style={{ marginInline: "10px 0" }}
              className={formErrors.notificationInterval ? 'error' : undefined}
              type="number"
              min="1"
              defaultValue={data?.notificationInterval}
              onBlur={handleBlur}
              name="notificationInterval"
              onChange={handleChange}
            />
            <p style={{ marginLeft: 10 }}>Min</p>
          </div>
        </div>
      </div>
      {formErrors.notificationInterval && (
        <span className='error-text'>{formErrors.notificationInterval}</span>
      )}
    </div>
  );
};

export default NotificationSetting;
