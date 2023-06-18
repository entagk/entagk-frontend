import React, {lazy} from 'react';

const Select = lazy(() => import('../Select/Select'));

const NotificationSetting = ({ data, setData, handleChange }) => {
  return (
    <div className='block notification' style={{ border: "none" }}>
      <h3>Notification</h3>
      <div className='notification-data'>
        <Select options={["every", "last"]} data={data} type="notificationType" setData={setData} width="100px" setChange={() => { }} />
        <div className='notification-min'>
          <input
            style={{ marginInline: "10px 0" }}
            className={data?.notificationInterval <= 0 ? 'error' : undefined}
            type="number"
            min="1"
            defaultValue={data?.notificationInterval}
            name="notificationInterval"
            onChange={handleChange} />
          <p style={{ marginLeft: 10 }}>Min</p>
        </div>
      </div>
    </div>
  );
};

export default NotificationSetting;
