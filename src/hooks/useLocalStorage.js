import { useState, useEffect } from 'react';

/**
 * Hook do zarządzania stanem w localStorage
 * @param {string} key - Klucz w localStorage
 * @param {any} initialValue - Początkowa wartość
 * @returns {[any, function]} Wartość i funkcja do jej aktualizacji
 */
export const useLocalStorage = (key, initialValue) => {
  // Funkcja do pobierania wartości z localStorage
  const getStoredValue = () => {
    try {
      const item = localStorage.getItem(key);
      // Sprawdź, czy wartość istnieje w localStorage
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Błąd podczas odczytu '${key}' z localStorage:`, error);
      return initialValue;
    }
  };
  
  // Stan z wartością z localStorage
  const [value, setValue] = useState(getStoredValue);
  
  // Aktualizacja localStorage przy zmianie wartości
  useEffect(() => {
    try {
      if (value === undefined) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error(`Błąd podczas zapisu '${key}' do localStorage:`, error);
    }
  }, [key, value]);
  
  return [value, setValue];
};