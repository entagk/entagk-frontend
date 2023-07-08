import React from 'react';

function InfoStep({ data, setData, handleChange }) {

  return (
    <div className='step-inputs'>
      <div className="block" style={{ position: "relative" }}>
        <input
          autoFocus
          className={`${!data.name && 'error'} name`}
          maxLength="50"
          required
          name="name"
          type="text"
          value={data.name}
          placeholder="Template title"
          onChange={handleChange}
        />
        <div className="text-counter" style={{ color: `${50 - data?.name?.length > 10 ? "#0effe9" : "#ff002f"}` }}>
          <p>{50 - data?.name?.length}</p>
        </div>
      </div>
      <div className="block">
        <div className="desc">
          <textarea
            name="desc"
            type='text'
            maxLength="500"
            onChange={handleChange}
            value={data.desc}
            placeholder='Template describtion'
            required
          ></textarea>
          <div
            className="text-counter"
            style={{
              color: `${500 - data?.desc?.length > 100 ? "#0effe9" : "#ff002f"}`
            }}>
            <p
              style={{
                fontSize: "16px",
                fontWeight: "500"
              }}
            >{500 - data?.desc?.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfoStep;
