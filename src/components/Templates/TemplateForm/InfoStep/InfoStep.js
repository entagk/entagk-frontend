import React, {Suspense, lazy} from 'react';

import Loading from '../../../../utils/Components/Loading/Loading';

import { types } from '../../../../utils/helper';

const Select = lazy(() => import('../../../../utils/Components/Select/Select'));

function InfoStep({
  data,
  handleChange,
  handleBlur,
  formErrors,
  setData,
}) {
  return (
    <div className='step-inputs'>
      <div className="block">
        <div className="task-type-name">
          <Suspense fallback={
            <Loading
              size="small"
              color={"#fff"}
              backgroud="transparent"
              paddingBlock='0'
            />
          }>
            <Select
              options={types}
              data={!('type' in data) ? { ...data, type: { name: "Nothing", code: "1F6AB" } } : data}
              type="type"
              setData={setData}
              width="fit-content"
              displayType="icon"
              setChange={() => { }}
              menuTop={50}
            />
          </Suspense>
          <div style={{
            position: "relative",
            width: "100%",
            marginLeft: "10px"
          }}>
            <input
              autoFocus
              className={`${formErrors.name && 'error'} name`}
              maxLength="50"
              required
              name="name"
              type="text"
              value={data.name}
              placeholder="What is task title?"
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {data?.name?.length > 30 && (
              <div className="text-counter" style={{ color: `${50 - data?.name?.length > 10 ? "#0effe9" : "#ff002f"}` }}>
                <p
                  style={{ fontSize: "16px", fontWeight: "500", marginBottom: "15px" }}
                >{50 - data?.name?.length}</p>
              </div>
            )}
            {formErrors.name && (
              <span className="error-text">
                {formErrors.name}
              </span>
            )}
          </div>
        </div>
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
          {data?.desc?.length > 400 && (
            <div
              className="text-counter"
            >
              <p
                style={{
                  fontSize: "16px",
                  fontWeight: "500"
                }}
              >{500 - data?.desc?.length}</p>
            </div>
          )}
        </div>
        {formErrors.desc && (
          <span className='error-text'>{formErrors.desc}</span>
        )}
      </div>
    </div>
  );
}

export default InfoStep;
