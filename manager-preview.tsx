import React from 'react';
import { createRoot } from 'react-dom/client';

import ManagerPage from './src/ManagerPage';
import './src/index.css';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Preview root element not found');
}

createRoot(root).render(
  <React.StrictMode>
    <ManagerPage />
  </React.StrictMode>,
);
