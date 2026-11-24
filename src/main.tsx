import React from 'react';
import { createRoot } from 'react-dom/client';

import AppRouter from './renderer/app/AppRouter';
import './renderer/styles/index.css';

import { createDemoSession } from './backend/storage/memory/demoSession';

const { credit, directory } = createDemoSession();
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <React.StrictMode>
    <AppRouter directory={directory} credit={credit} />
  </React.StrictMode>
)
