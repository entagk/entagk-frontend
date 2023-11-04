import React, { lazy, useEffect, useState } from 'react';
import { updateUser } from '../../actions/auth';
import { useSelector, useDispatch } from 'react-redux';

import { CgClose } from 'react-icons/cg';

import Button from '../../utils/Components/Button/Button';

import './style.css'
import ToggleButton from '../../utils/Components/ToggleButton/ToggleButton';
import Loading from '../../utils/Components/Loading/Loading';
import Input from '../../utils/Components/Input/Input';
import Header from '../../utils/Components/GlassEffectHeader/header';

const ChangeAvatar = lazy(() => import('./ChangeAvatar/ChangeAvatar'));

function EditAccount({ setClose, setMessage }) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth?.user);
  const [data, setData] = useState({ name: user.name });
  const { isLoading } = useSelector(state => state.auth);
  const [formErrors, setFormError] = useState({});
  const [validations, setValidations] = useState({ 'name': () => data.name.trim().length > 0 })
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
                setFormError(fE => ({ ...fE, [f]: "The password must be at least 8 letters and numbers" }));
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

  const handleSubmit = async (event) => {
    await event.preventDefault();

    const dataEntries = Object.entries(data);
    const errors = Object.entries(formErrors).filter(([k, v]) => v.length > 0);
    dataEntries.forEach(([k, v]) => {
      if (v === '' && requiredFields.includes(k)) {
        errors.push([k, 'This is required']);
        setFormError(fep => ({ ...fep, [k]: 'This is required' }));
      }
    });

    if (errors.length === 0) {
      dispatch(updateUser(data, setFormError, setMessage));
    }
  }

  const requiredForEveryInput = {
    formErrors: formErrors,
    setFormError: setFormError,
    validations: validations,
    formData: data,
    setFormData: setData,
    requiredFields: requiredFields,
  }

  return (
    <div className='glass-container'>
      <form className='glass-effect edit-account' onSubmit={handleSubmit}>
        <Header
          title='Edit account'
          RightButton={
            <Button
              aria-label='close edit account'
              className="close"
              type='button'
              onClick={() => setClose(false)}
              variant='none'
              startIcon={
                <CgClose />
              }
            />
          }
        />
        <div className='inputs'>
          <ChangeAvatar />
          <Input
            {...requiredForEveryInput}
            name="name"
            type="name"
            placeholder="name"
          />
          <div className='block change-password'>
            <p>
              change password
            </p>
            <ToggleButton data={changePassword} setData={setChangePassword} />
          </div>
          {changePassword && (
            <>
              <Input
                {...requiredForEveryInput}
                type="password"
                name="oldPassword"
                placeholder="old password"
                aria-label="old password"
              />
              <Input
                {...requiredForEveryInput}
                placeholder="new password"
                type="password"
                name="newPassword"
                aria-label="new password"
              />
              <Input
                {...requiredForEveryInput}
                type="password"
                name="confirmNewPassword"
                placeholder="confirm new password"
                aria-label="confirm new password"
              />
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
