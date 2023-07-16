import React, { Suspense, lazy } from 'react';

import { AiOutlinePlus, AiOutlineSearch } from 'react-icons/ai';

import { RiArrowDownSLine } from "react-icons/ri";

import './style.css';
import { useDispatch, useSelector } from 'react-redux';
import { SEARCH_USER_TEMPLATRES, SORT_USER_TEMPLATRES, getTemplatesForUser, searchTemplates } from '../../../actions/templates';
import { END_LOADING, START_LOADING } from '../../../actions/auth';

const Menu = lazy(() => import('../../../utils/Menu/Menu'));
const MenuItem = lazy(() => import('../../../utils/Menu/MenuItem'));

function SearchBar({ setOpenFormForNew, searchParams, setSearchParams, setMessage }) {
  const dispatch = useDispatch();
  const { templates, total, originalData } = useSelector(state => state.templates.userTemplates);

  const handleChangeSearchQuery = (e) => {
    const sort = searchParams.get('sort');
    searchParams.set("search", e.target.value);
    setSearchParams(searchParams);

    if (originalData?.templates?.length === originalData?.total) {
      dispatch({ type: START_LOADING, data: 'templates' });
      dispatch({ type: SEARCH_USER_TEMPLATRES, data: { query: e.target.value, page: 1 } })
      dispatch({ type: END_LOADING, data: 'templates' });
    } else {
      dispatch(searchTemplates(e.target.value, sort, 1, setMessage));
    }
  }

  const handleSortElement = (e) => {
    const search = searchParams.get('search');
    searchParams.set("sort", e.target.value);
    setSearchParams(searchParams);

    if (templates?.length === total) {
      dispatch({ type: START_LOADING, data: 'templates' });
      dispatch({ type: SORT_USER_TEMPLATRES, data: e.target.key })
      dispatch({ type: END_LOADING, data: 'templates' });
    } else {
      if (search !== '') {
        dispatch(searchTemplates(search, e.target.key, 1, setMessage, total, templates.length));
      } else {
        dispatch(getTemplatesForUser("updatedAt", 1, setMessage))
      }
    }
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
        <Suspense fallback={<></>}>
          <Menu MainButton={
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
