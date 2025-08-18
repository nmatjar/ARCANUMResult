import { useState, useEffect } from 'react';
import { clientDataService } from '../../services/client-data-service.js';
import { aiEngine } from '../../services/ai-engine.js';
import { ArcanumLoader } from './ArcanumLoader.jsx';
import { ErrorPage } from './ErrorPage.jsx';
import { CodeInput } from './CodeInput.jsx';
import PromptCatalogPage from '../../pages/PromptCatalogPage.jsx';

/**
 * ARCĀNUM Layout - Główny komponent Results Portal
 * Nowa wersja - ładuje dane i od razu przechodzi do katalogu promptów.
 */
export const ArcanumLayout = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const initialClientCode = urlParams.get('client') || urlParams.get('code') || urlParams.get('clientCode');
  
  const [clientCode, setClientCode] = useState(initialClientCode);
  const [clientData, setClientData] = useState(null);
  const [loading, setLoading] = useState(!!initialClientCode);
  const [error, setError] = useState(null);
  const [showCodeInput, setShowCodeInput] = useState(!initialClientCode);
  
  const dataService = clientDataService;

  useEffect(() => {
    if (clientCode) {
      initializeClient();
    }
  }, [clientCode]);

  const handleCodeSubmit = async (code) => {
    setClientCode(code);
    setShowCodeInput(false);
    setLoading(true);
    setError(null);
    
    const newUrl = new URL(window.location);
    newUrl.searchParams.set('client', code);
    window.history.pushState({}, '', newUrl);
  };

  const initializeClient = async () => {
    try {
      setLoading(true);
      setError(null);

      const hasAccess = await dataService.validateClientAccess(clientCode);
      if (!hasAccess) {
        throw new Error('Brak dostępu do wyników lub dostęp wygasł');
      }

      const vectors = await dataService.getClientVectors(clientCode);
      setClientData(vectors);

      // Sesja AI jest inicjalizowana, ale nie generujemy od razu wyników
      await aiEngine.initializeSession(vectors);

      await dataService.logAccess(clientCode, {
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      });

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      
      if (err.message.includes('dostęp') || err.message.includes('access')) {
        setShowCodeInput(true);
        setClientCode(null);
      }
    }
  };

  if (showCodeInput) {
    return <CodeInput onCodeSubmit={handleCodeSubmit} loading={loading} />;
  }

  if (loading) {
    return <ArcanumLoader message="Pobieranie i weryfikacja danych..." />;
  }

  if (error) {
    return (
      <ErrorPage 
        error={error} 
        onRetry={() => {
          if (clientCode) {
            initializeClient();
          } else {
            setShowCodeInput(true);
            setError(null);
          }
        }}
        onGoHome={() => window.location.href = '/'}
      />
    );
  }

  // Po załadowaniu danych klienta, od razu pokazujemy katalog promptów
  return <PromptCatalogPage clientData={clientData} />;
};
