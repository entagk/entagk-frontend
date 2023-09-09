import React, { useRef, useState } from 'react'
import { BlockButton, Button } from '../utils/components'
import usePopup from '../utils/usePopup';
import { isBlockActive } from '../utils';

import iconList from '../utils/icons';

const BlockTypeButton = ({ editor, setOpenPopup, popupRef }) => {
  const buttonsRef = useRef(null);
  const [showButtons, setShowButtons] = usePopup(buttonsRef);
  const types = [
    'paragraph',
    "heading-one",
    "heading-two",
    "block-quote",
    "numbered-list",
    "bulleted-list",
  ];

  const [activeType, setActiveType] = useState(types.filter(t => isBlockActive(editor, t))[0] || types[0]);

  return (
    <div ref={buttonsRef} className='popup-wrapper'>
      <Button
        onClick={() => {
          setShowButtons(sB => !sB);
          setOpenPopup(oP => oP !== activeType ? activeType : "")
        }}
        style={{
          width: '30px',
          height: '30px'
        }}
      >
        <span
          style={{
            color: "#000"
          }}
          className="toolbar-icon"
        >
          {activeType === types[0] ? 'P' : (
            <>
              {iconList[activeType]}
            </>
          )}
        </span>
      </Button>
      {showButtons && (
        <div className='popup' ref={popupRef}>
          <div
            className='buttons'
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {types.map((type, i) => (
              <BlockButton
                key={i}
                format={type}
                icon={i === 0 ? 'P' : type}
                style={{
                  width: '30px',
                  height: '30px',
                  marginBottom: 0,
                }}
                onClick={() => {
                  setOpenPopup("")
                  setShowButtons(sB => !sB);
                  setActiveType(type);
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default BlockTypeButton
