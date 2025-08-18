import { createContext, useState } from 'react';
import PropTypes from 'prop-types';
import { verifyCareerCode, generateContent } from '../services/apiService';
const deductTokens = async (userId, tokensToDeduct) => {
  const response = await fetch('/.netlify/functions/deduct-tokens', {
    method: 'POST',
    body: JSON.stringify({ userId, tokensToDeduct }),
  });
  return response.json();
};
import { callOpenRouterAPI } from '../utils/openRouterApi';
import { TOKEN_COSTS, APP_CONFIG, featuresConfig } from '../config/featuresConfig';
import { useLocalStorage } from '../hooks/useLocalStorage';

// Tworzenie kontekstu
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
  // Używamy useLocalStorage zamiast zwykłego useState dla persystencji
  const [userCode, setUserCode] = useLocalStorage('userCode', '');
  const [userData, setUserData] = useLocalStorage('userData', null);
  const [isCodeVerified, setIsCodeVerified] = useLocalStorage('isCodeVerified', false);
  const [activeFeature, setActiveFeature] = useState(null);
  const [results, setResults] = useLocalStorage('results', {});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Weryfikacja kodu
  const verifyCode = async (code) => {
    setLoading(true);
    setError('');
    
    try {
      const result = await verifyCareerCode(code);
      
      if (result.success) {
        setUserCode(code);
        setUserData(result.userData || null);
        setIsCodeVerified(true);
        return { success: true };
      } else {
        setError(result.message);
        return { success: false, message: result.message };
      }
    } catch (error) {
      const errorMessage = 'Wystąpił błąd podczas weryfikacji kodu';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };
  
  // Wybór funkcji i generowanie treści
  const selectFeature = async (featureId) => {
    setLoading(true);
    setError('');
    setActiveFeature(featureId);
    
    // Pobierz konfigurację funkcji
    const feature = featuresConfig.find(f => f.id === featureId);
    
    // Sprawdź, czy to asystent AI
    if (feature && feature.useAIAssistant) {
      // Dla asystenta AI nie musimy wykonywać żadnych zapytań API
      // Po prostu zwracamy pusty obiekt wyniku, który zostanie uzupełniony przez komponent
      setLoading(false);
      
      // Najpierw sprawdź, czy użytkownik ma wystarczającą ilość energii
      const tokensRequired = TOKEN_COSTS[featureId] || 300;
      
      if (!userData || !userData.id) {
        throw new Error('Brak identyfikatora użytkownika');
      }
      
      if (!APP_CONFIG.TEST_MODE) {
        // Sprawdź, czy użytkownik ma wystarczająco energii
        const hasEnoughTokens = userData.tokens >= tokensRequired;
        if (!hasEnoughTokens) {
          setError(`Niewystarczająca ilość energii. Dostępne: ${userData.tokens}, wymagane: ${tokensRequired}`);
          return { 
            success: false, 
            message: `Niewystarczająca ilość energii. Dostępne: ${userData.tokens}, wymagane: ${tokensRequired}`,
            tokenBalance: userData.tokens
          };
        }
        
        // Tutaj nie odejmujemy energii - będzie odejmowana przy każdym zapytaniu do asystenta
      }
      
      // Zwróć pusty obiekt wynikowy, który zostanie obsłużony przez komponent asystenta
      return {
        success: true,
        content: '',
        featureId,
        useAIAssistant: true
      };
    }
    
    // Dla standardowych funkcji - stara logika
    // Sprawdź, czy mamy już zapisane wyniki dla tej funkcji
    if (results[featureId]) {
      setLoading(false);
      return results[featureId];
    }
    
    try {
      // Check if user has enough tokens
      const tokensRequired = TOKEN_COSTS[featureId] || 100;
      
      if (!userData || !userData.id) {
        throw new Error('Brak identyfikatora użytkownika');
      }
      
      // Check if test mode is enabled
      if (APP_CONFIG.TEST_MODE) {
        // Bypass energy deduction in test mode
        const result = await generateContent(featureId, userCode, userData);
        
        if (result.success) {
          // Zapisz wyniki
          setResults(prev => ({
            ...prev,
            [featureId]: result
          }));
          return {
            ...result,
            tokenBalance: userData.tokens
          };
        } else {
          setError(result.message);
          return { 
            success: false, 
            message: result.message,
            tokenBalance: userData.tokens
          };
        }
      } else {
        const tokenResult = await deductTokens(userData.id, tokensRequired);
        
        if (!tokenResult.success) {
          setError(`Niewystarczająca ilość energii. Dostępne: ${tokenResult.newBalance}, wymagane: ${tokensRequired}`);
          return { 
            success: false, 
            message: `Niewystarczająca ilość energii. Dostępne: ${tokenResult.newBalance}, wymagane: ${tokensRequired}`,
            tokenBalance: tokenResult.newBalance
          };
        }
        
        const updatedUserData = {
          ...userData,
          tokens: tokenResult.newBalance
        };
        setUserData(updatedUserData);
        
        // Generate content
        const result = await generateContent(featureId, userCode, updatedUserData);
        
        if (result.success) {
          // Zapisz wyniki
          setResults(prev => ({
            ...prev,
            [featureId]: result
          }));
          return {
            ...result,
            tokenBalance: tokenResult.newBalance
          };
        } else {
          setError(result.message);
          return { 
            success: false, 
            message: result.message,
            tokenBalance: tokenResult.newBalance
          };
        }
      }
    } catch (error) {
      const errorMessage = error.message || 'Wystąpił błąd podczas generowania treści';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };
  
  // Funkcja do obsługi wiadomości chatu z API OpenRouter - odjęcie energii i wykonanie zapytania
  const sendChatMessage = async (prompt, model, systemPrompt, options = {}) => {
    if (APP_CONFIG.TEST_MODE) {
      // W trybie testowym nie odejmujemy energii
      console.log('Test mode active: Skipping energy deduction for chat message');
      return await callOpenRouterAPI(prompt, model, systemPrompt, options);
    }
    
    // Sprawdź czy użytkownik ma wystarczającą ilość energii
    const tokensRequired = 10; // Pojedyncza wiadomość chatu kosztuje mniej niż pełna funkcja
    
    if (!userData || !userData.id) {
      throw new Error('Brak identyfikatora użytkownika');
    }
    
    const tokenResult = await deductTokens(userData.id, tokensRequired);
    
    if (!tokenResult.success) {
      throw new Error(`Niewystarczająca ilość energii. Dostępne: ${tokenResult.newBalance}, wymagane: ${tokensRequired}`);
    }
    
    const updatedUserData = {
      ...userData,
      tokens: tokenResult.newBalance
    };
    setUserData(updatedUserData);
    
    // Wykonaj zapytanie do API
    return await callOpenRouterAPI(prompt, model, systemPrompt, options);
  };

  // Odświeżanie wyników (generowanie na nowo)
  const refreshResult = async (featureId) => {
    setLoading(true);
    setError('');
    
    try {
      // Usuwamy zapisane wyniki
      const updatedResults = { ...results };
      delete updatedResults[featureId];
      setResults(updatedResults);
      
      // Check if user has enough tokens
      const tokensRequired = TOKEN_COSTS[featureId] || 100;
      
      if (!userData || !userData.id) {
        throw new Error('Brak identyfikatora użytkownika');
      }
      
      // Check if test mode is enabled
      if (APP_CONFIG.TEST_MODE) {
        // Skip energy deduction in test mode
        console.log('Test mode active: Skipping energy deduction in refreshResult');
        
        // Generate content without energy deduction
        const result = await generateContent(featureId, userCode, userData);
        
        if (result.success) {
          // Zapisz wyniki
          setResults(prev => ({
            ...prev,
            [featureId]: result
          }));
          return {
            ...result,
            tokenBalance: userData.tokens || 1000
          };
        } else {
          setError(result.message);
          return { 
            success: false, 
            message: result.message,
            tokenBalance: userData.tokens
          };
        }
      } else {
        const tokenResult = await deductTokens(userData.id, tokensRequired);
        
        if (!tokenResult.success) {
          setError(`Niewystarczająca ilość energii. Dostępne: ${tokenResult.newBalance}, wymagane: ${tokensRequired}`);
          return { 
            success: false, 
            message: `Niewystarczająca ilość energii. Dostępne: ${tokenResult.newBalance}, wymagane: ${tokensRequired}`,
            tokenBalance: tokenResult.newBalance
          };
        }
        
        const updatedUserData = {
          ...userData,
          tokens: tokenResult.newBalance
        };
        setUserData(updatedUserData);
        
        // Generujemy na nowo
        return await selectFeature(featureId);
      }
    } catch (error) {
      setError('Wystąpił błąd podczas odświeżania wyników');
      return { success: false, message: 'Wystąpił błąd podczas odświeżania wyników' };
    }
  };
  
  // Wylogowanie użytkownika
  const logout = () => {
    setUserCode('');
    setUserData(null);
    setIsCodeVerified(false);
    setActiveFeature(null);
    setResults({});
    // Usunięcie danych z localStorage jest obsługiwane automatycznie przez hook useLocalStorage
  };

  const clearError = () => setError('');
  
  const clearActiveFeature = () => setActiveFeature(null);

  // Funkcja do aktualizacji danych użytkownika
  const updateUserData = async () => {
    if (userData?.id) {
      try {
        const response = await fetch(`/.netlify/functions/get-user-by-id?userId=${userData.id}`);
        const updatedUserData = await response.json();
        setUserData(updatedUserData);
      } catch (error) {
        console.error("Error updating user data:", error);
      }
    }
  };

  const value = {
    userCode,
    userData,
    isCodeVerified,
    loading,
    error,
    activeFeature,
    results,
    verifyCode,
    selectFeature,
    refreshResult,
    logout,
    clearError,
    clearActiveFeature,
    sendChatMessage, // Dodajemy funkcję dla komponentu chat
    updateUserData // Dodajemy funkcję do aktualizacji danych użytkownika
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
