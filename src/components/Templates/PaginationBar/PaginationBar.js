import React, { useEffect, useState } from 'react';

import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';

import './style.css';
import { getPages } from '../../../utils/helper';

function PaginationBar({ numberOfPages, currentPage, changePage }) {
  const [pages, setPages] = useState(getPages(currentPage, numberOfPages))

  useEffect(() => {
    setPages(getPages(currentPage, numberOfPages));
    // eslint-disable-next-line
  }, [currentPage])

  return (
    <div className='pagination-bar'>
      <button
        aria-label='previous arrow button'
        className='prev-arrow'
        onClick={() => changePage(currentPage - 1)}
        disabled={currentPage - 1 === 0}
      >
        <MdKeyboardArrowLeft />
      </button>
      <div className='pages'>
        {pages.map(page => (
          <>
            {page === '...' ? (
              <p>...</p>
            ) : (
              <button key={page} className={`page-num ${page === currentPage ? 'active' : ''}`}
                onClick={() => changePage(page)}
              >
                {page}
              </button>
            )}
          </>
        ))}
      </div>
      <button
        aria-label='next arrow button'
        className='prev-arrow'
        disabled={numberOfPages === currentPage}
        onClick={() => changePage(currentPage + 1)}
      >
        <MdKeyboardArrowRight />
      </button>
    </div>
  );
}

export default PaginationBar;
