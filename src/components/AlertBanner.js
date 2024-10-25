// src/components/AlertBanner.js
import React from 'react';

const AlertBanner = ({ message }) => {
    return (
        <div style={{ padding: '10px', backgroundColor: 'red', color: 'white' }}>
            {message}
        </div>
    );
};

export default AlertBanner;
