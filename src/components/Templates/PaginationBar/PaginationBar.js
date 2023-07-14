import React, { useEffect, useState } from 'react';

import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';

import './style.css';

function PaginationBar({ numberOfPages, currentPage, changePage }) {
  const pages = new Array(numberOfPages).fill(1).map((p, i) => i + 1);
  const [beforePages, setBeforePages] = useState(pages.slice(1, currentPage - 1))
  const [afterPages, setAfterPages] = useState(numberOfPages !== 2 ? [2] : []);

  useEffect(() => {
    if (currentPage > 1) {
      if (currentPage !== 2) {
        setBeforePages([currentPage - 1])
      } else {
        setBeforePages([])
      }
      if (currentPage < numberOfPages - 1) {
        setAfterPages([currentPage + 1])
      } else {
        setAfterPages([])
      }
    }
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
        <button key={1} className={`page-num ${1 === currentPage ? 'active' : ''}`}
          onClick={() => changePage(1)}
        >
          1
        </button>
        {(beforePages[0] > 2) && (<p>...</p>)}
        {beforePages.map(page => (
          <button key={page} className={`page-num ${page === currentPage ? 'active' : ''}`}
            onClick={() => changePage(page)}
          >
            {page}
          </button>
        ))}
        {(currentPage !== 1 && currentPage !== numberOfPages) && (
          <>
            <button key={currentPage} className={'page-num active'}
              onClick={() => changePage(currentPage)}
            >
              {currentPage}
            </button>
          </>
        )}
        {afterPages.map(page => (
          <button key={page} className={`page-num ${page === currentPage ? 'active' : ''}`}
            onClick={() => changePage(page)}
          >
            {page}
          </button>
        ))}
        {(numberOfPages - afterPages[0] > 1) && (<p>...</p>)}
        <button key={numberOfPages} className={`page-num ${numberOfPages === currentPage ? 'active' : ''}`}
          onClick={() => changePage(numberOfPages)}
        >
          {numberOfPages}
        </button>
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
