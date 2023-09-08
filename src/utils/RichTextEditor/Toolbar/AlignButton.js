import React, { useRef, useState } from 'react';
import { BlockButton, Button } from '../utils/components';
import usePopup from '../utils/usePopup';
import { isBlockActive } from '../utils';

import iconList from '../utils/icons';

const AlignButton = ({ editor }) => {
  const buttonsRef = useRef(null);
  const [showButtons, setShowButtons] = usePopup(buttonsRef);
  const types = [
    "left",
    "center",
    "right",
    "justify",
  ];

  const [activeType, setActiveType] = useState(types.filter(t => isBlockActive(editor, t, 'align'))[0] || types[0]);

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
          {iconList["align-" + activeType]}
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
                format={type}
                icon={"align-" + type}
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

export default AlignButton;
