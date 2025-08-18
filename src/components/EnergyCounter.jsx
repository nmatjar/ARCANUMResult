import React, { useState, useEffect } from 'react';
import { useUserContext } from '../contexts/UserContext';
import { TOKEN_PACKAGES, APP_CONFIG } from '../config/featuresConfig';
import { PaymentModal } from './PaymentModal';
import '../assets/styles/EnergyCounter.css';

export const EnergyCounter = ({ tokens }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { userData } = useUserContext();
  
  // State to track and toggle test mode locally
  const [testMode, setTestMode] = useState(APP_CONFIG.TEST_MODE);
  
  // Keep testMode state in sync with APP_CONFIG.TEST_MODE
  useEffect(() => {
    setTestMode(APP_CONFIG.TEST_MODE);
  }, [APP_CONFIG.TEST_MODE]);
  
  const handleBuyEnergy = () => {
    setShowPaymentModal(true);
    setShowTooltip(false);
  };
  
  // Toggle test mode
  const toggleTestMode = () => {
    // Update local state
    setTestMode(!testMode);
    
    // Update global config
    APP_CONFIG.TEST_MODE = !APP_CONFIG.TEST_MODE;
    
    // Keep tooltip open
  };
  
  // Toggle tooltip visibility on click instead of hover
  const toggleTooltip = () => {
    setShowTooltip(!showTooltip);
  };
  
  // Close tooltip without changing other states
  const closeTooltip = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    setShowTooltip(false);
  };
  
  return (
    <>
      <div className="energy-counter">
        <div 
          className="energy-display"
          onClick={toggleTooltip}
        >
          <i className="fa-solid fa-bolt"></i>
          <span className="energy-amount">{tokens || 0}</span>
          {testMode && (
            <span className="test-mode-badge" title="Tryb testowy aktywny - energia nie jest zużywana">
              <i className="fa-solid fa-flask"></i>
            </span>
          )}
        </div>
        
        {showTooltip && (
          <div className="energy-tooltip">
            <div className="tooltip-header">
              <h4>Jednostki energii</h4>
              <button 
                className="close-tooltip-button" 
                onClick={closeTooltip}
                aria-label="Zamknij"
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            
            {testMode ? (
              <p className="test-mode-active">
                <i className="fa-solid fa-flask"></i> Tryb testowy aktywny - wszystkie funkcje są darmowe!
              </p>
            ) : (
              <p>Każda operacja zużywa 100 jednostek energii.</p>
            )}
            <p>Dostępna energia: <strong>{tokens || 0}</strong></p>
            <p>Po wyczerpaniu energii, doładuj aby korzystać z dodatkowych funkcji.</p>
            
            {/* Test mode toggle button */}
            <button 
              className={`test-mode-toggle ${testMode ? 'active' : ''}`}
              onClick={toggleTestMode}
            >
              {testMode ? 'Wyłącz tryb testowy' : 'Włącz tryb testowy'}
            </button>
            
            <button 
              className="buy-energy-button"
              onClick={handleBuyEnergy}
            >
              Doładuj energię
            </button>
          </div>
        )}
      
      {showPaymentModal && (
        <PaymentModal 
          packages={TOKEN_PACKAGES}
          userId={userData?.id}
          onClose={() => setShowPaymentModal(false)}
        />
      )}
      </div>
    </>
  );
};