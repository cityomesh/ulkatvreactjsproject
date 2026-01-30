import React from 'react';
import { COLOR_FOCUS, COLOR_WHITE } from '../constants';

const CustomKeyboard = ({ layout, isCaps, focusedPos, isKeyboardFocused }) => {
  return (
    <div style={{
      width: '900px',
      padding: '20px',
      backgroundColor: 'rgba(20,20,20,0.95)',
      borderRadius: '15px',
      border: '1px solid #333'
    }}>
      {layout.map((row, rIdx) => (
        <div key={rIdx} style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '10px' }}>
          {row.map((key, cIdx) => {
            const focused =
              isKeyboardFocused &&
              focusedPos.row === rIdx &&
              focusedPos.col === cIdx;

            return (
              <div
                key={key}
                style={{
                  flex: key === 'SPACE' ? 4 : key === 'ENTER' || key === 'CAPS' ? 1.5 : 1,
                  height: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: focused ? COLOR_FOCUS : '#333',
                  color: COLOR_WHITE,
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  fontSize: '18px',
                  border: focused ? '3px solid white' : '1px solid transparent',
                  transform: focused ? 'scale(1.1)' : 'scale(1)',
                  transition: 'all 0.1s'
                }}
              >
                {key === 'BACK'
                  ? '⌫'
                  : key.length === 1
                    ? (isCaps ? key.toUpperCase() : key.toLowerCase())
                    : key}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default CustomKeyboard;
