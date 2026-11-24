import React from 'react';
import { createRoot } from 'react-dom/client';

import AppRouter from './app/AppRouter';
import './styles/index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
)
