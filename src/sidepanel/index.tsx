import React from 'react';
import ReactDOM from 'react-dom/client';
import AshokApp from './AshokApp';
import { ErrorBoundary } from './ErrorBoundary';
import '../styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AshokApp />
    </ErrorBoundary>
  </React.StrictMode>
);
