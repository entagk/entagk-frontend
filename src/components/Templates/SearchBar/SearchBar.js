import React, { Suspense, lazy, useState } from 'react';

import { AiOutlinePlus, AiOutlineSearch } from 'react-icons/ai';

import { RiArrowDownSLine } from "react-icons/ri";

import './style.css';
import { useDispatch } from 'react-redux';
import { getTemplatesForUser } from '../../../actions/templates';

import Loading from '../../../utils/Loading/Loading';

const Menu = lazy(() => import('../../../utils/Menu/Menu'));
const MenuItem = lazy(() => import('../../../utils/Menu/MenuItem'));

function SearchBar({ setOpenFormForNew, searchParams, setSearchParams, setMessage }) {
  const dispatch = useDispatch();
  const [openMenu, setOpenMenu] = useState(false);

  const handleChangeSearchQuery = (e) => {
    const sort = searchParams.get('sort');
    searchParams.set("search", e.target.value);
    setSearchParams(searchParams);

    dispatch(getTemplatesForUser(sort, e.target.value, 1, setMessage));
  }

  const handleSortElement = (e) => {
    setOpenMenu(false);
    const search = searchParams.get('search');
    searchParams.set("sort", e.target.value);
    setSearchParams(searchParams);

    dispatch(getTemplatesForUser(e.target.value, search, 1, setMessage))
  }

  return (
    <div className='search-bar'>
      <div>
        <div className='search-keyword'>
          <span className='icon'>
            <AiOutlineSearch />
          </span>
          <input
            type='search'
            placeholder='Write your query'
            value={searchParams.get('search') || ""}
            onChange={handleChangeSearchQuery}
          />
        </div>
        <Suspense fallback={
          <Loading
            size="small"
            color={"#fff"}
            backgroud="transparent"
            style={{ paddingBlock: '0' }}
          />
        }>
          <Menu
            open={openMenu}
            setOpen={setOpenMenu}
            MainButton={
              <button
                aria-label="toggle the task list menu"
                className="toggle-menu"
              >
                <span className='text'>
                  Sort
                </span>
                <span className='icon'>
                  <RiArrowDownSLine className='arrow' />
                </span>
              </button>
            }>
            <MenuItem
              aria-label="Last updated sort choice"
              type='button'
              value="updatedAt"
              onClick={handleSortElement}
            >
              Last Updated
            </MenuItem>
            <MenuItem
              aria-label="Name sort choice"
              type='button'
              value="name"
              onClick={handleSortElement}>
              Name
            </MenuItem>
          </Menu>
        </Suspense>
      </div>
      <button aria-label='New template' className='add-temp' onClick={() => setOpenFormForNew(true)}>
        <span className='icon'>
          <AiOutlinePlus />
        </span>
        <span className='text'>
          Add Template
        </span>
      </button>
    </div>
  );
}

export default SearchBar;
