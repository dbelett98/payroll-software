// index.js: Main entry file (updated to remove reportWebVitals – free fix for module not found).
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// No reportWebVitals import or call (free removal to fix error).

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);