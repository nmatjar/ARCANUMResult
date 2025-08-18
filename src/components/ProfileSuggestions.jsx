import React, { useState } from 'react';
import { PROFILE_EXTENSION_FIELDS } from '../services/profileExtensionsService';
import '../assets/styles/ProfileSuggestions.css';

/**
 * Komponent wyświetlający sugestie uzupełnienia profilu użytkownika
 * @param {Object} props - Właściwości komponentu
 * @param {Array} props.suggestions - Tablica sugestii do profilu
 * @param {Function} props.onAccept - Funkcja wywoływana po zaakceptowaniu sugestii
 * @param {Function} props.onReject - Funkcja wywoływana po odrzuceniu sugestii
 * @returns {JSX.Element} Element React
 */
const ProfileSuggestions = ({ suggestions, onAccept, onReject }) => {
  const [actionStatus, setActionStatus] = useState({});
  
  if (!suggestions || suggestions.length === 0) {
    return null;
  }
  
  const handleAccept = (suggestion, index) => {
    // Ustaw status dla tej sugestii
    setActionStatus({
      ...actionStatus,
      [index]: { status: 'accepted', message: 'Dodano do profilu' }
    });
    
    // Wywołaj funkcję przekazaną z zewnątrz
    onAccept(suggestion);
    
    // Po 3 sekundach usuń status
    setTimeout(() => {
      setActionStatus(prev => {
        const newStatus = { ...prev };
        delete newStatus[index];
        return newStatus;
      });
    }, 3000);
  };
  
  const handleReject = (suggestion, index) => {
    // Ustaw status dla tej sugestii
    setActionStatus({
      ...actionStatus,
      [index]: { status: 'rejected', message: 'Odrzucono' }
    });
    
    // Wywołaj funkcję przekazaną z zewnątrz
    onReject(suggestion);
    
    // Po 3 sekundach usuń status
    setTimeout(() => {
      setActionStatus(prev => {
        const newStatus = { ...prev };
        delete newStatus[index];
        return newStatus;
      });
    }, 3000);
  };
  
  return (
    <div className="profile-suggestions">
      <h3>Znaleźliśmy informacje, które mogą uzupełnić Twój profil:</h3>
      
      {suggestions.map((suggestion, index) => (
        <div key={index} className={`suggestion-card ${actionStatus[index]?.status || ''}`}>
          <div className="suggestion-content">
            <span className="field-name">
              {PROFILE_EXTENSION_FIELDS[suggestion.field]?.label || suggestion.field}:
            </span>
            <p className="suggested-value">{suggestion.value}</p>
          </div>
          
          <div className="suggestion-actions">
            {!actionStatus[index] ? (
              <>
                <button 
                  className="accept-btn" 
                  onClick={() => handleAccept(suggestion, index)}
                  aria-label={`Dodaj "${suggestion.value}" do profilu`}
                >
                  <i className="fa-solid fa-check"></i> Dodaj do profilu
                </button>
                <button 
                  className="reject-btn" 
                  onClick={() => handleReject(suggestion, index)}
                  aria-label="Odrzuć sugestię"
                >
                  <i className="fa-solid fa-times"></i> Odrzuć
                </button>
              </>
            ) : (
              <div className={`status-message ${actionStatus[index].status}`}>
                <i className={`fa-solid ${actionStatus[index].status === 'accepted' ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
                {actionStatus[index].message}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProfileSuggestions;