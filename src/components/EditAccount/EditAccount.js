import React, { lazy, useEffect, useState } from 'react';
import { updateUser } from '../../actions/auth';
import { useSelector, useDispatch } from 'react-redux';

import { CgClose } from 'react-icons/cg';

import Button from '../../utils/Button/Button';

import './style.css'
import ToggleButton from '../../utils/ToggleButton/ToggleButton';
import Password from '../Auth/Password/Password';
import Loading from '../../utils/Loading/Loading';

const ChangeAvatar = lazy(() => import('./ChangeAvatar/ChangeAvatar'));

function EditAccount({ setClose, setMessage }) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth?.user);
  const [data, setData] = useState({ name: user.name });
  const { isLoading } = useSelector(state => state.auth);
  const [formErrors, setFormError] = useState({});
  const [validations, setValidations] = useState({ 'name': () => data.name.trim.length > 0 })
  const [changePassword, setChangePassword] = useState(false);

  const [requiredFields, setRequiredFields] = useState(['name']);
  const passwordRequired = ['oldPassword', 'newPassword', 'confirmNewPassword'];

  useEffect(() => {
    if (changePassword) {
      setRequiredFields(rf => [...rf, ...passwordRequired]);
      passwordRequired.forEach((f) => {
        setData(pd => ({ ...pd, [f]: "" }));
        if (f === 'oldPassword' || f === 'newPassword') {
          setValidations(pVs => ({
            ...pVs,
            [f]: (d) => {
              if (d.length < 8) {
                setFormError(fE => ({ ...fE, [f]: "The password shouldn't be less than 8 letter or numbers" }));
                return true;
              } else {
                setFormError(fE => ({ ...fE, [f]: "" }))
                return false;
              }
            }
          }))
        } else {
          setValidations(pVs => ({
            ...pVs,
            [f]: (d, cD) => {
              if (d !== cD) {
                setFormError(fE => ({ ...fE, [f]: "The password should be matched" }))
                return true;
              } else {
                setFormError(fE => ({ ...fE, [f]: "" }))
                return false;
              }
            }
          }))
        }
      })
    } else {
      setRequiredFields(rfs => rfs.filter(rf => !passwordRequired.includes(rf)));
      passwordRequired.forEach((f) => {
        const newData = data;
        delete newData[f];
        setData(newData);

        const newFormErrors = formErrors;
        delete newFormErrors[f];
        setFormError(newFormErrors)
      })
    }

    // eslint-disable-next-line
  }, [changePassword]);

  const handleFieldError = (field, value, validateFun) => {
    if (value) {
      if (field === 'confirmNewPassword') {
        validateFun(value, data['newPassword']);
      } else {
        validateFun(value);
      }
    } else {
      setFormError(fep => ({ ...fep, [field]: '' }))
    }
  }

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value
    });

    if (e.target.value !== '' && formErrors[e.target.name] === 'This is required') {
      setFormError(fep => ({ ...fep, [e.target.name]: '' }));
    }
  }

  const onBlur = (e) => {
    if (e.target.value === '' && requiredFields.includes(e.target.name)) {
      setFormError(fep => ({ ...fep, [e.target.name]: 'This is required' }));
    } else {
      handleFieldError(
        e.target.name,
        e.target.value,
        validations[e.target.name]
      );
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const dataEntries = Object.entries(data);
    const errors = Object.entries(formErrors).filter(([k, v]) => v.length > 0);
    dataEntries.forEach(([k, v]) => {
      if (v === '') {
        errors.push([k, 'This is required']);
        setFormError(fep => ({ ...fep, [k]: 'This is required' }));
      }
    });

    if (errors.length === 0) {
      dispatch(updateUser(data, setFormError, setMessage));
    }
  }

  return (
    <div className='glass-container'>
      <form className='glass-effect edit-account' onSubmit={handleSubmit}>
        <div className='edit-account-header'>
          <h2>Edit Account</h2>
          <Button
            aria-label='close edit account'
            className="close-edit-account"
            type='button'
            onClick={() => setClose(false)}
            variant='none'
            startIcon={
              <CgClose />
            }
          />
        </div>
        <div className='inputs'>
          <ChangeAvatar />
          <div className='block'>
            <input
              name="name"
              type="name"
              placeholder="name"
              value={data.name}
              onChange={handleChange}
              className={formErrors.name?.length > 0 ? 'error' : undefined}
              onBlur={onBlur}
            />
            {formErrors.name?.length > 0 && (
              <span className='error-text'>
                {formErrors['name']}
              </span>
            )}
          </div>
          <div className='block change-password'>
            <p>
              change password
            </p>
            <ToggleButton data={changePassword} setData={setChangePassword} />
          </div>
          {changePassword && (
            <>
              <div className='block'>
                <Password
                  name="oldPassword"
                  placeholder="old password"
                  formData={data}
                  handleChange={handleChange}
                  onBlur={onBlur}
                />
                {formErrors['oldPassword'] && (
                  <span className='error-text'>
                    {formErrors['oldPassword']}
                  </span>
                )}
              </div>
              <div className='block'>
                <Password
                  placeholder="new password"
                  formData={data}
                  handleChange={handleChange}
                  onBlur={onBlur}
                  name="newPassword"
                />
                {formErrors['newPassword'] && (
                  <span className='error-text'>
                    {formErrors['newPassword']}
                  </span>
                )}
              </div>
              <div className='block'>
                <Password
                  formData={data}
                  handleChange={handleChange}
                  onBlur={onBlur}
                  name="confirmNewPassword"
                  placeholder="confirm new password"
                />
                {formErrors['confirmNewPassword'] && (
                  <span className='error-text'>
                    {formErrors['confirmNewPassword']}
                  </span>
                )}
              </div>
            </>
          )}
        </div>
        <div className='footer'>
          <Button
            className='save'
            type='submit'
            aria-label='submit form'
            variant='contained'
            color="main"
            disabled={isLoading || Object.values(formErrors).filter(fE => fE.length > 0).length > 0}
          >
            {
              isLoading ?
                <Loading
                  size="small"
                  color={"#fff"}
                  backgroud="transparent"
                  style={{ margin: 0 }}
                />
                :
                'Ok'
            }
          </Button>
          <Button
            type='button'
            aria-label='cancel form'
            onClick={() => setClose(false)}
            variant='outlined'
            className="cancel"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

export default EditAccount;
