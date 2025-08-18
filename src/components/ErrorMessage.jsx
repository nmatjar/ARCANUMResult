import React from 'react';
import '../assets/styles/ErrorMessage.css';

export const ErrorMessage = ({ message, onClose }) => {
  return (
    <div className="error-container" role="alert">
      <div className="error-content">
        <i className="fa-solid fa-circle-exclamation"></i>
        <span>{message}</span>
        <button 
          className="error-close" 
          onClick={onClose}
          aria-label="Zamknij komunikat o błędzie"
        >
          <i className="fa-solid fa-times"></i>
        </button>
      </div>
    </div>
  );
};