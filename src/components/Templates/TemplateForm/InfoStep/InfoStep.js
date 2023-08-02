import React from 'react';

function InfoStep({
  data,
  handleChange,
  handleBlur,
  formErrors
}) {

  return (
    <div className='step-inputs'>
      <div className="block">
        <div style={{ position: "relative" }}>
          <input
            autoFocus
            className={`${formErrors.name && 'error'} name`}
            maxLength="50"
            required
            name="name"
            type="text"
            value={data.name}
            placeholder="Template title"
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <div className="text-counter" style={{ color: `${50 - data?.name?.length > 10 ? "#0effe9" : "#ff002f"}` }}>
            <p>{50 - data?.name?.length}</p>
          </div>
        </div>
        {formErrors.name && (
          <span className='error-text'>{formErrors.name}</span>
        )}
      </div>
      <div className="block">
        <div className="desc">
          <textarea
            name="desc"
            type='text'
            maxLength="500"
            onChange={handleChange}
            onBlur={handleBlur}
            value={data.desc}
            placeholder='Template describtion'
            className={`${formErrors.desc && 'error'} name`}
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
        {formErrors.desc && (
          <span className='error-text'>{formErrors.desc}</span>
        )}
      </div>
    </div>
  );
}

export default InfoStep;
