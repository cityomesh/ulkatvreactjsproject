import React from 'react';
import { COLOR_WHITE } from '../constants';

const Icon = ({ name, size = 20, color = COLOR_WHITE }) => {
    const icons = {
        'eye-off-outline': '👁️‍🗨️', 
        'eye-outline': '👁️',       
        'chevron-down': '▼'
    };
    return (
        <span style={{ fontSize: size, color }}>{icons[name] || '❔'}</span>
    );
};

export default Icon;
