import React from 'react';
import { COLOR_FOCUS, COLOR_WHITE } from '../constants';

const GlobalInputStyles = () => (
    <style>
        {`
            ::selection {
                background: ${COLOR_FOCUS}; 
                color: ${COLOR_WHITE};
            }
            input:-webkit-autofill,
            input:-webkit-autofill:hover, 
            input:-webkit-autofill:focus, 
            input:-webkit-autofill:active {
                -webkit-box-shadow: 0 0 0 1000px rgba(255, 255, 255, 0.1) inset !important; 
                -webkit-text-fill-color: ${COLOR_WHITE} !important; 
                transition: background-color 5000s ease-in-out 0s; 
            }
        `}
    </style>
);

export default GlobalInputStyles;
