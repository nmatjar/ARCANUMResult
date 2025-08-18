/**
 * ARCĀNUM Context - Zarządzanie stanem Results Portal
 * Centralne zarządzanie danymi klienta i poziomami analizy
 */

import { createContext, useContext, useReducer } from 'react';
import PropTypes from 'prop-types';
import { clientDataService } from '../services/client-data-service.js';
import { aiEngine } from '../services/ai-engine.js';

// Typy akcji
const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_CLIENT_DATA: 'SET_CLIENT_DATA',
  SET_CURRENT_LEVEL: 'SET_CURRENT_LEVEL',
  SET_LEVEL_DATA: 'SET_LEVEL_DATA',
  SET_ANALYSIS_COMPLETE: 'SET_ANALYSIS_COMPLETE',
  RESET_STATE: 'RESET_STATE'
};

// Stan początkowy
const initialState = {
  // Stan ładowania i błędów
  loading: false,
  error: null,
  
  // Dane klienta
  clientId: null,
  clientData: null,
  
  // Poziomy analizy
  currentLevel: 1,
  completedLevels: [],
  levelData: {
    1: null, // Hero Dashboard
    2: null, // Strategic Dimensions
    3: null, // Advanced Analytics
    4: null, // Hidden Gems
    5: null  // Academic Compass
  },
  
  // Stan analizy
  analysisComplete: false,
  analysisProgress: 0
};

// Reducer
function arcanumReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
        error: action.payload ? null : state.error
      };
      
    case ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
      
    case ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
      
    case ACTIONS.SET_CLIENT_DATA:
      return {
        ...state,
        clientId: action.payload.clientId,
        clientData: action.payload.data,
        loading: false,
        error: null
      };
      
    case ACTIONS.SET_CURRENT_LEVEL:
      return {
        ...state,
        currentLevel: action.payload
      };
      
    case ACTIONS.SET_LEVEL_DATA: {
      const newCompletedLevels = [...state.completedLevels];
      if (!newCompletedLevels.includes(action.payload.level)) {
        newCompletedLevels.push(action.payload.level);
      }
      
      const progress = Math.round((newCompletedLevels.length / 5) * 100);
      
      return {
        ...state,
        levelData: {
          ...state.levelData,
          [action.payload.level]: action.payload.data
        },
        completedLevels: newCompletedLevels,
        analysisProgress: progress,
        loading: false,
        error: null
      };
    }
      
    case ACTIONS.SET_ANALYSIS_COMPLETE:
      return {
        ...state,
        analysisComplete: action.payload,
        analysisProgress: action.payload ? 100 : state.analysisProgress
      };
      
    case ACTIONS.RESET_STATE:
      return {
        ...initialState
      };
      
    default:
      return state;
  }
}

// Context
const ArcanumContext = createContext();

// Provider Component
export function ArcanumProvider({ children }) {
  const [state, dispatch] = useReducer(arcanumReducer, initialState);
  
  // Funkcje pomocnicze
  const setLoading = (loading) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: loading });
  };
  
  const setError = (error) => {
    dispatch({ type: ACTIONS.SET_ERROR, payload: error });
  };
  
  const clearError = () => {
    dispatch({ type: ACTIONS.CLEAR_ERROR });
  };
  
  const resetState = () => {
    dispatch({ type: ACTIONS.RESET_STATE });
  };
  
  // Ładowanie danych klienta
  const loadClientData = async (clientId) => {
    try {
      setLoading(true);
      const data = await clientDataService.getClientVectors(clientId);
      
      if (!data) {
        throw new Error('Nie znaleziono danych klienta');
      }
      
      dispatch({
        type: ACTIONS.SET_CLIENT_DATA,
        payload: { clientId, data }
      });
      
      return data;
    } catch (error) {
      console.error('Błąd ładowania danych klienta:', error);
      setError(error.message || 'Błąd ładowania danych klienta');
      throw error;
    }
  };
  
  // Przejście do poziomu
  const navigateToLevel = (level) => {
    if (level >= 1 && level <= 5) {
      dispatch({ type: ACTIONS.SET_CURRENT_LEVEL, payload: level });
    }
  };
  
  // Generowanie analizy dla poziomu
  const generateLevelAnalysis = async (level) => {
    try {
      setLoading(true);
      
      if (!state.clientData) {
        throw new Error('Brak danych klienta');
      }
      
      // Sprawdź czy analiza już istnieje
      if (state.levelData[level]) {
        setLoading(false);
        return state.levelData[level];
      }
      
      // Generuj analizę używając AI Engine
      const analysisData = await aiEngine.generateLevel(level);
      
      dispatch({
        type: ACTIONS.SET_LEVEL_DATA,
        payload: { level, data: analysisData }
      });
      
      // Sprawdź czy to ostatni poziom
      if (level === 5) {
        dispatch({ type: ACTIONS.SET_ANALYSIS_COMPLETE, payload: true });
      }
      
      return analysisData;
    } catch (error) {
      console.error(`Błąd generowania analizy poziomu ${level}:`, error);
      setError(error.message || `Błąd generowania analizy poziomu ${level}`);
      throw error;
    }
  };
  
  // Regenerowanie analizy
  const regenerateLevelAnalysis = async (level) => {
    try {
      setLoading(true);
      
      // Wyczyść istniejące dane poziomu
      dispatch({
        type: ACTIONS.SET_LEVEL_DATA,
        payload: { level, data: null }
      });
      
      // Generuj ponownie
      return await generateLevelAnalysis(level);
    } catch (error) {
      console.error(`Błąd regenerowania analizy poziomu ${level}:`, error);
      setError(error.message || `Błąd regenerowania analizy poziomu ${level}`);
      throw error;
    }
  };
  
  // Sprawdzenie czy poziom jest dostępny
  const isLevelAvailable = (level) => {
    if (level === 1) return true; // Hero Dashboard zawsze dostępny
    return state.completedLevels.includes(level - 1); // Poprzedni poziom musi być ukończony
  };
  
  // Sprawdzenie czy poziom jest ukończony
  const isLevelCompleted = (level) => {
    return state.completedLevels.includes(level);
  };
  
  // Pobieranie danych poziomu
  const getLevelData = (level) => {
    return state.levelData[level];
  };
  
  // Pobieranie statusu poziomu
  const getLevelStatus = (level) => {
    if (state.currentLevel === level && state.loading) {
      return 'loading';
    }
    if (isLevelCompleted(level)) {
      return 'completed';
    }
    if (isLevelAvailable(level)) {
      return 'available';
    }
    return 'locked';
  };
  
  // Eksport danych do PDF/JSON
  const exportAnalysis = async (format = 'pdf') => {
    try {
      const exportData = {
        clientId: state.clientId,
        clientData: state.clientData,
        levelData: state.levelData,
        completedLevels: state.completedLevels,
        analysisComplete: state.analysisComplete,
        exportDate: new Date().toISOString()
      };
      
      if (format === 'json') {
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
          type: 'application/json'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `arcanum-analysis-${state.clientId}.json`;
        a.click();
        URL.revokeObjectURL(url);
      } else if (format === 'pdf') {
        // TODO: Implementacja eksportu PDF
        console.log('PDF export - do implementacji');
      }
      
      return true;
    } catch (error) {
      console.error('Błąd eksportu:', error);
      setError('Błąd podczas eksportu danych');
      return false;
    }
  };
  
  // Wartość kontekstu
  const contextValue = {
    // Stan
    ...state,
    
    // Funkcje zarządzania stanem
    setLoading,
    setError,
    clearError,
    resetState,
    
    // Funkcje danych klienta
    loadClientData,
    
    // Funkcje poziomów
    navigateToLevel,
    generateLevelAnalysis,
    regenerateLevelAnalysis,
    isLevelAvailable,
    isLevelCompleted,
    getLevelData,
    getLevelStatus,
    
    // Funkcje eksportu
    exportAnalysis
  };
  
  return (
    <ArcanumContext.Provider value={contextValue}>
      {children}
    </ArcanumContext.Provider>
  );
}

ArcanumProvider.propTypes = {
  children: PropTypes.node.isRequired
};

// Hook do używania kontekstu
export function useArcanum() {
  const context = useContext(ArcanumContext);
  
  if (!context) {
    throw new Error('useArcanum musi być używany wewnątrz ArcanumProvider');
  }
  
  return context;
}

// Eksport domyślny
export default ArcanumContext;
