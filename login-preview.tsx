import React from 'react';
import { createRoot } from 'react-dom/client';

import Login from './src/Login';
import './src/index.css';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Preview root element not found');
}

createRoot(root).render(
  <React.StrictMode>
    <Login />
  </React.StrictMode>,
);
