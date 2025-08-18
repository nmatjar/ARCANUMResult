/**
 * ARCĀNUM Results Portal - Punkt wejścia aplikacji
 */

import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { UserProvider } from './contexts/UserContext.jsx';
import './index.css';
import './i18n';

// Konfiguracja React w trybie strict
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Suspense fallback="loading">
      <UserProvider>
        <App />
      </UserProvider>
    </Suspense>
  </React.StrictMode>
);
