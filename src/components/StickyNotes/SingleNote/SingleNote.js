import React, { lazy, Suspense, useState } from 'react';
import Loading from '../../../utils/Loading/Loading';

import './style.css';

const TextEditor = lazy(() => import('../../../utils/RichTextEditor/Editor'));
const Header = lazy(() => import('./Header'));

const SingleNote = () => {
  const [value, setValue] = useState([
    {
      type: "paragraph",
      children: [
        { text: "This is editable " },
        { text: "rich", bold: true },
        { text: " text, " },
        { text: "much", italic: true },
        { text: " better than a " },
        { text: "<textarea>", code: true },
        { text: "!" }
      ]
    }
  ]);
  
  return (
    <div className='sticky-note'>
      <Suspense
        fallback={
          <Loading
            color="white"
            backgroud="transparent"
            size="big"
          />
        }
      >
        <Header />
        <TextEditor value={value} setValue={setValue} />
      </Suspense>
    </div>
  )
}

export default SingleNote;
