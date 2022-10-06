import React from 'react';
import { BsFillArrowLeftCircleFill } from 'react-icons/bs';
import { Link } from 'react-router-dom';

function Header({ linkClick }) {
  return (
    <div className='setting-header'>
      <Link onClick={linkClick} to="/" aria-label='back button' style={{fontSize: "30px"}}>
        <BsFillArrowLeftCircleFill />
      </Link>
      <h1>Setting</h1>
    </div>
  );
}

export default Header;