// import './lib/api-interceptor';
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
import './index.css';

// Mitigate benign Vite HMR WebSocket errors & media play interruptions from showing overlays on preview
if (typeof window !== 'undefined') {
  const isIgnoredError = (str: string) => {
    const s = (str || '').toLowerCase();
    return (
      s.includes('websocket') ||
      s.includes('ws://') ||
      s.includes('wss://') ||
      s.includes('play()') ||
      s.includes('interrupted') ||
      s.includes('media was removed') ||
      s.includes('removed from the document') ||
      s.includes('aborterror')
    );
  };

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const reasonStr = (
      String(reason || '') +
      ' ' +
      String(reason?.message || '') +
      ' ' +
      String(reason?.name || '') +
      ' ' +
      String(reason?.stack || '')
    ).toLowerCase();

    if (isIgnoredError(reasonStr)) {
      event.preventDefault();
      event.stopPropagation();
    }
  });

  window.addEventListener('error', (event) => {
    const message = (event.message || '') + ' ' + String(event.error?.message || '');
    if (isIgnoredError(message)) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);

  // Fallback direct window.onerror hook
  const originalOnError = window.onerror;
  window.onerror = function (message, source, lineno, colno, error) {
    const msgStr = String(message || '') + ' ' + String(error?.message || '');
    if (isIgnoredError(msgStr)) {
      return true;
    }
    if (originalOnError) {
      return originalOnError(message, source, lineno, colno, error);
    }
    return false;
  };
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

