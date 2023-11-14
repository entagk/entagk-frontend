import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AiFillCamera } from 'react-icons/ai';

import { stringToColor } from '../../../utils/helper';

import { UPDATE_USER } from '../../../actions/auth';

import Loading from '../../../utils/Components/Loading/Loading';
import './style.css';

import { BASE_URL } from '../../../api';

function ChangeAvatar() {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [imageSrc, setImageSrc] = useState(user?.avatar);
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePicture = async (e) => {
    setIsLoading(true);

    setImageSrc(URL?.createObjectURL(e.target.files[0]));
    const logoFormData = new FormData()
    logoFormData.set('avatar', e.target.files[0]);
    const uploadedData = await fetch(
      `${BASE_URL}/upload/image/avatar/`,
      {
        method: 'POST',
        body: logoFormData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    const { user } = await uploadedData.json();
    dispatch({ type: UPDATE_USER, data: user });

    setIsLoading(false);
  }

  return (
    <div className='block'>
      <div className="change-avatar" style={{ margin: "5px", background: stringToColor(user.name) }}>
        {isLoading && (
          <Loading
            size="medium"
            color={"#fff"}
            backgroud="transparent"
            className="center-fullpage"
            style={{
              position: 'absolute',
              margin: 0,
              background: '#ffffff40',
              borderRadius: 'inherit',
              zIndex: 1010
            }}
          />
        )}
        <label
          htmlFor="icon-button-file"
          style={{ backgroundImage: `url(${imageSrc})` }}>
          {!imageSrc && (
            <p>{user.name[0]}</p>
          )}
          <input
            onChange={handleChangePicture}
            accept="image/*"
            id="icon-button-file"
            type="file" />
          <span aria-label="upload picture">
            <AiFillCamera />
          </span>
        </label>
      </div>
    </div>
  );
}

export default ChangeAvatar;
