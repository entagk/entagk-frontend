import React, { Suspense, lazy, useState } from 'react';

import { AiOutlinePlus, AiOutlineSearch } from 'react-icons/ai';

import { RiArrowDownSLine } from "react-icons/ri";

import './style.css';
import { useDispatch } from 'react-redux';
import { getTemplatesForUser } from '../../../actions/templates';

import Loading from '../../../utils/Loading/Loading';
import Button from '../../../utils/Button/Button';

const Menu = lazy(() => import('../../../utils/Menu/Menu'));

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
              <Button
                aria-label="toggle the task list menu"
                className="toggle-menu"
                endIcon={
                  <RiArrowDownSLine className='arrow' />
                }
                variant='outlined'
              >
                Sort
              </Button>
            }>
            <Button
              aria-label="Last updated sort choice"
              type='button'
              value="updatedAt"
              onClick={handleSortElement}
              variant='none'
            >
              Last Updated
            </Button>
            <Button
              aria-label="Name sort choice"
              type='button'
              value="name"
              variant='none'
              onClick={handleSortElement}>
              Name
            </Button>
          </Menu>
        </Suspense>
      </div>
      <Button
        aria-label='New template'
        className='add-temp'
        onClick={() => setOpenFormForNew(true)}
        startIcon={
          <AiOutlinePlus />
        }
        variant='contained'
        style={{
          border: 'none'
        }}
      >
        Add Template
      </Button>
    </div>
  );
}

export default SearchBar;
