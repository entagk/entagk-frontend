import React from 'react';

import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';

import './style.css';

function PaginationBar({ numberOfPages, currentPage, changePage }) {
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
        {(currentPage <= 2 && numberOfPages > 3) ? (
          <>
            <button key={2} onClick={() => changePage(2)} className={`page-num ${2 === currentPage ? 'active' : ''}`}>
              2
            </button>
            <p>...</p>
          </>
        ) : (currentPage >= numberOfPages - 1) && numberOfPages > 2 ? (
          <>
            <p>...</p>
            <button key={numberOfPages - 1} onClick={() => changePage(numberOfPages - 1)} className={`page-num ${numberOfPages - 1 === currentPage ? 'active' : ''}`}>
              {numberOfPages - 1}
            </button>
          </>
        ) : numberOfPages > 2 && (
          <>
            {(currentPage - 1 !== 2 && numberOfPages > 2) && (
              <p>...</p>
            )}
            <button key={currentPage - 1} onClick={() => changePage(currentPage - 1)} className='page-num'>
              {currentPage - 1}
            </button>
            <button key={currentPage} className='active' onClick={() => changePage(currentPage)}>
              {currentPage}
            </button>
            <button key={currentPage + 1} className={`page-num`} onClick={() => changePage(currentPage + 1)} >
              {currentPage + 1}
            </button>
            {(currentPage + 1 !== numberOfPages - 1 && numberOfPages !== 2) && (
              <p>...</p>
            )}
          </>
        )}
        <button
          key={numberOfPages}
          onClick={() => changePage(numberOfPages)}
          className={`page-num ${numberOfPages === currentPage ? 'active' : ''}`}>
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
