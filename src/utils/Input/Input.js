import React from 'react';
import Password from '../../components/Auth/Password/Password';

import './style.css'

function Input({
  formErrors,
  setFormError,
  validations,
  formData,
  setFormData,
  requiredFields,
  name,
  ...props
}) {
  const handleFieldError = (field, value, validateFun) => {
    if (value) {
      if (field === 'confirmPassword') {
        validateFun(value, formData['password']);
      } else {
        validateFun(value);
      }
    } else {
      setFormError(fep => ({ ...fep, [field]: '' }))
    }
  }

  const handleChange = (e) => {
    console.log(e.target.name)
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (
      e.target.value !== ''
    ) {
      setFormError(fep => ({ ...fep, [e.target.name]: '' }));
    }

    console.log(formData)
  }
  
  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (value === '' && requiredFields.includes(name)) {
      setFormError(fep => ({ ...fep, [name]: 'This is required' }));
    } else {
      handleFieldError(
        e.target.name,
        e.target.value,
        validations[e.target.name]
      );
    }
  };

  return (
    <div className='input-block'>
      {name.toLowerCase().includes('password') ? (
        <Password
          name={name}
          required={requiredFields.includes(name)}
          formData={formData}
          onChange={handleChange}
          onBlur={handleBlur}
          formErrors={formErrors}
          {...props}
        />
      ) : (
        <input
          name={name}
          value={formData[name]}
          className={formErrors[name] ? 'error' : undefined}
          required={requiredFields.includes(name)}
          onChange={handleChange}
          onBlur={handleBlur}
          {...props}
        />
      )}
      {formErrors[name] && (
        <span className='error-text'>{formErrors[name]}</span>
      )}
    </div>
  );
}

export default Input;
