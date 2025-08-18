import React, { useState } from 'react';
import '../assets/styles/CodeEntry.css';

export const CodeEntry = ({ onVerify, isLoading }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!code || code.length < 8) {
      setError('Wprowadź poprawny kod (min. 8 znaków)');
      setTimeout(() => setError(''), 3000);
      return;
    }
    
    const result = await onVerify(code);
    
    if (!result.success) {
      setError(result.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="code-entry-container">
      <h1>Odkryj swoją idealną ścieżkę kariery</h1>
      <p>Wpisz swój unikalny kod testu kariery, aby zobaczyć spersonalizowane rekomendacje.</p>
      
      <form onSubmit={handleSubmit} className="code-form">
        <div className="input-group">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Np. IK-2025-ABC123"
            disabled={isLoading}
            aria-label="Kod testu kariery"
          />
          {error && <div className="error-message">{error}</div>}
        </div>
        
        <button 
          type="submit" 
          className="primary-button"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="button-spinner"></span>
              <span>Weryfikacja...</span>
            </>
          ) : (
            'Odblokuj swoje wyniki'
          )}
        </button>
      </form>
    </div>
  );
};