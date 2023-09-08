import React, { useRef, useState } from 'react'
import { BlockButton, Button } from '../utils/components'
import usePopup from '../utils/usePopup';
import { isBlockActive } from '../utils';

import iconList from '../utils/icons';

const BlockTypeButton = ({ editor, setOpenPopup }) => {
  const buttonsRef = useRef(null);
  const [showButtons, setShowButtons] = usePopup(buttonsRef)
  const types = [
    { format: 'paragraph', type: 'block' },
    { format: "heading-one", type: "block" },
    { format: "heading-two", type: "block" },
    { format: "block-quote", type: "block" },
    { format: "numbered-list", type: "block" },
    { format: "bulleted-list", type: "block" },
  ];

  console.log(buttonsRef);
  const [activeType, setActiveType] = useState(types.filter(t => isBlockActive(editor, t.format))[0] || types[0]);

  return (
    <div ref={buttonsRef} className='popup-wrapper'>
      <Button
        onClick={() => {
          setShowButtons(sB => !sB);
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
          {activeType.format === types[0].format ? 'P' : (
            <>
              {iconList[activeType.format]}
            </>
          )}
        </span>
      </Button>
      {showButtons && (
        <div className='popup'>
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
                format={type.format}
                icon={i === 0 ? 'P' : type.format}
                style={{
                  width: '30px',
                  height: '30px',
                  marginBottom: 0,
                }}
                onClick={() => {
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
