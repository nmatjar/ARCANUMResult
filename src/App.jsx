/**
 * ARCĀNUM Results Portal - Główna aplikacja
 * Nowoczesny portal wyników z 5-poziomową analizą
 */

import { useState, useEffect } from 'react';
import { ArcanumProvider } from './contexts/ArcanumContext.jsx';
import { ArcanumLayout } from './components/arcanum/ArcanumLayout.jsx';
import { ArcanumLoader } from './components/arcanum/ArcanumLoader.jsx';
import { ErrorPage } from './components/arcanum/ErrorPage.jsx';
import './assets/styles/arcanum-theme.css';
import './assets/styles/arcanum-levels.css';

function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [initError, setInitError] = useState(null);

  useEffect(() => {
    // Inicjalizacja aplikacji - bez wymagania kodu w URL
    const initializeApp = async () => {
      try {
        // Symulacja ładowania konfiguracji
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Błąd inicjalizacji aplikacji:', error);
        setInitError(error.message);
      }
    };

    initializeApp();
  }, []);

  // Ekran ładowania podczas inicjalizacji
  if (!isInitialized && !initError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <ArcanumLoader 
          message="Inicjalizacja ARCĀNUM Portal..."
          showProgress={true}
        />
      </div>
    );
  }

  // Ekran błędu inicjalizacji
  if (initError) {
    return (
      <ErrorPage 
        title="Błąd inicjalizacji"
        message={initError}
        showRetry={true}
        onRetry={() => window.location.reload()}
      />
    );
  }

  // Główna aplikacja
  return (
    <ArcanumProvider>
      <div className="arcanum-app">
        <ArcanumLayout />
      </div>
    </ArcanumProvider>
  );
}

export default App;
