import React from 'react';
import { useUserContext } from '../contexts/UserContext';
import '../assets/styles/Header.css';
import { EnergyCounter } from './EnergyCounter';
import { useNavigate } from 'react-router-dom';

export const Header = ({ toggleAssistant }) => {
  const { isCodeVerified, logout, userData, clearActiveFeature } = useUserContext();
  const navigate = useNavigate();
  
  const goToHomePage = () => {
    navigate('/');
    clearActiveFeature(); // Wyczyść aktywną funkcję, jeśli istnieje
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo" onClick={goToHomePage} role="button" tabIndex="0" onKeyDown={(e) => e.key === 'Enter' && goToHomePage()}>
            <i className="fa-solid fa-lightbulb"></i>
            <span>Inteligentna Kariera</span>
          </div>
          
          {isCodeVerified && (
            <div className="header-actions">
              {userData && (
                <>
                  <button 
                    className="assistant-button" 
                    onClick={toggleAssistant}
                    aria-label="Asystent AI"
                    title="Otwórz asystenta kariery AI"
                  >
                    <i className="fa-solid fa-robot"></i>
                    <span>Asystent AI</span>
                  </button>
                  <EnergyCounter tokens={userData.tokens} />
                </>
              )}
              
              <button 
                className="logout-button" 
                onClick={logout}
                aria-label="Wyloguj się"
              >
                <i className="fa-solid fa-arrow-right-from-bracket"></i>
                <span>Wyloguj</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};