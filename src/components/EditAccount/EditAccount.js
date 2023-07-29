import React, { useState } from 'react';
import { updateUser } from '../../actions/auth';
import { useSelector, useDispatch } from 'react-redux';

import { CgClose } from 'react-icons/cg';

import Button from '../../utils/Button/Button';

import './style.css'
import ChangeAvatar from './ChangeAvatar/ChangeAvatar';

function EditAccount({ setClose }) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth?.user);
  const [data, setData] = useState(user);
  const [message, setMessage] = useState({ message: "", type: "" });

  const requiredFields = ['name',];
  const [formErrors, setFormError] = useState({});

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setClose(false);
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
        <ChangeAvatar />
        <div className='block'>
          <input
            name="name"
            type="name"
            placeholder="name"
            value={data.name}
            onChange={handleChange}
            className={!data.name ? 'error' : undefined}
          />
        </div>
        <div className='footer'>
          <Button
            className='save'
            type='submit'
            aria-label='submit form'
            variant='contained'
            color="main"
          >Ok</Button>
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
