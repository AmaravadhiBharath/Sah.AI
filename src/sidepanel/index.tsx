import React from 'react';
import ReactDOM from 'react-dom/client';
import SeviApp from './SeviApp';
import { ErrorBoundary } from './ErrorBoundary';
import '../styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <SeviApp />
    </ErrorBoundary>
  </React.StrictMode>
);
