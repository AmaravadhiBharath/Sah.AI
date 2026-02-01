import ReactDOM from 'react-dom/client';
import { ErrorBoundary } from './ErrorBoundary';
import KaboomApp from './KaboomApp';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <ErrorBoundary>
    <KaboomApp />
  </ErrorBoundary>
);
