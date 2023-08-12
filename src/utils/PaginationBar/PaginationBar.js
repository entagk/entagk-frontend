import React, { useEffect, useState } from 'react';

import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';

import './style.css';
import { getPages } from '../helper';
import Button from '../Button/Button';

function PaginationBar({ numberOfPages, currentPage, changePage }) {
  const [pages, setPages] = useState(getPages(currentPage, numberOfPages))

  useEffect(() => {
    setPages(getPages(currentPage, numberOfPages));
    // eslint-disable-next-line
  }, [currentPage, numberOfPages])

  return (
    <div className='pagination-bar'>
      <Button
        aria-label='previous arrow button'
        className='prev-arrow'
        onClick={() => changePage(currentPage - 1)}
        disabled={currentPage - 1 === 0}
        startIcon={
          <MdKeyboardArrowLeft />
        }
        variant='single-icon'
      />
      <div className='pages'>
        {pages.map(page => (
          <>
            {page === '...' ? (
              <p>...</p>
            ) : (
              <Button
                key={page}
                className={`page-num ${page === currentPage ? 'active' : ''}`}
                onClick={() => changePage(page)}
                variant='single-icon'
              >
                {page}
              </Button>
            )}
          </>
        ))}
      </div>
      <Button
        aria-label='next arrow button'
        className='prev-arrow'
        disabled={numberOfPages === currentPage}
        onClick={() => changePage(currentPage + 1)}
        variant='single-icon'
        startIcon={
          <MdKeyboardArrowRight />
        }
      />
    </div>
  );
}

export default PaginationBar;
