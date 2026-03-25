import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Log environment check
try {
  console.log('[Main] App initializing...');
  console.log('[Main] Environment:', import.meta.env.MODE);
  
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found');
  }

  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
  
  console.log('[Main] App mounted successfully');
} catch (error) {
  console.error('[Main] Failed to initialize app:', error);
  // Show error in DOM
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background-color: #0a0c1a; color: #ef4444; text-align: center; padding: 20px;">
        <h1 style="font-size: 2rem; margin-bottom: 1rem;">⚠️ App Failed to Load</h1>
        <p style="font-size: 1rem; color: #94a3b8; max-width: 600px; margin-bottom: 1rem;">
          Please check the browser console for details.
        </p>
        <pre style="background: #1e293b; padding: 1rem; border-radius: 8px; overflow: auto; max-width: 80%;">
          ${error instanceof Error ? error.message : String(error)}
        </pre>
        <button onclick="window.location.reload()" style="margin-top: 2rem; padding: 0.75rem 1.5rem; background: #3b82f6; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 1rem;">
          Retry
        </button>
      </div>
    `;
  }
}

