import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';

/**
 * Model Selector - Komponent do wyboru modelu AI
 * Pozwala użytkownikowi wybrać model AI do analizy
 */
export const ModelSelector = ({ 
  availableModels, 
  currentModel, 
  onModelChange, 
  disabled = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleModelSelect = (modelId) => {
    onModelChange(modelId);
    setIsOpen(false);
  };

  const currentModelData = availableModels.find(m => m.id === currentModel);

  return (
    <div className="model-selector">
      {/* Trigger Button */}
      <button
        className={`model-selector-trigger ${disabled ? 'disabled' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <div className="model-info">
          <span className="model-icon">{currentModelData?.icon || '🤖'}</span>
          <div className="model-details">
            <span className="model-name">{currentModelData?.name || 'AI Model'}</span>
            <span className="model-status">
              {disabled ? 'Analiza w toku...' : 'Kliknij aby zmienić'}
            </span>
          </div>
        </div>
        <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && !disabled && (
          <motion.div
            className="model-dropdown"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="dropdown-header">
              <h3>Wybierz Model AI</h3>
              <p>Każdy model ma unikalne cechy analizy</p>
            </div>

            <div className="models-list">
              {availableModels.map((model) => (
                <motion.button
                  key={model.id}
                  className={`model-option ${model.id === currentModel ? 'active' : ''} ${
                    model.recommended ? 'recommended' : ''
                  }`}
                  onClick={() => handleModelSelect(model.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="model-option-content">
                    <div className="model-header">
                      <span className="model-icon">{model.icon}</span>
                      <div className="model-title">
                        <span className="model-name">{model.name}</span>
                        {model.recommended && (
                          <span className="recommended-badge">Polecany</span>
                        )}
                      </div>
                      {model.id === currentModel && (
                        <span className="current-indicator">✓</span>
                      )}
                    </div>
                    <p className="model-description">{model.description}</p>
                  </div>
                </motion.button>
              ))}
            </div>

            <div className="dropdown-footer">
              <p className="note">
                💡 Zmiana modelu wyczyści bieżącą sesję analizy
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="model-selector-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

ModelSelector.propTypes = {
  availableModels: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    recommended: PropTypes.bool
  })).isRequired,
  currentModel: PropTypes.string.isRequired,
  onModelChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

// CSS Styles (dodaj do arcanum-theme.css)
export const modelSelectorStyles = `
.model-selector {
  position: relative;
  z-index: 1000;
}

.model-selector-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 12px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 280px;
  backdrop-filter: blur(10px);
}

.model-selector-trigger:hover:not(.disabled) {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(212, 175, 55, 0.5);
  transform: translateY(-1px);
}

.model-selector-trigger.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.model-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.model-icon {
  font-size: 24px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(212, 175, 55, 0.2);
  border-radius: 8px;
}

.model-details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.model-name {
  font-weight: 600;
  font-size: 14px;
  color: var(--arcanum-swiss-gold);
}

.model-status {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

.dropdown-arrow {
  font-size: 12px;
  transition: transform 0.3s ease;
  color: rgba(255, 255, 255, 0.7);
}

.dropdown-arrow.open {
  transform: rotate(180deg);
}

.model-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 8px;
  background: rgba(27, 41, 81, 0.95);
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 16px;
  backdrop-filter: blur(20px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.dropdown-header {
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
}

.dropdown-header h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--arcanum-swiss-gold);
}

.dropdown-header p {
  margin: 0;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
}

.models-list {
  padding: 12px;
  max-height: 400px;
  overflow-y: auto;
}

.model-option {
  width: 100%;
  padding: 16px;
  margin-bottom: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
}

.model-option:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(212, 175, 55, 0.3);
}

.model-option.active {
  background: rgba(212, 175, 55, 0.1);
  border-color: var(--arcanum-swiss-gold);
}

.model-option.recommended {
  border-color: rgba(45, 80, 22, 0.5);
}

.model-option-content {
  width: 100%;
}

.model-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.model-title {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
}

.model-option .model-name {
  font-size: 16px;
  font-weight: 600;
  color: white;
}

.recommended-badge {
  background: var(--arcanum-forest-green);
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
}

.current-indicator {
  color: var(--arcanum-swiss-gold);
  font-weight: bold;
  font-size: 18px;
}

.model-description {
  margin: 0;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.4;
}

.dropdown-footer {
  padding: 16px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.2);
}

.dropdown-footer .note {
  margin: 0;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
}

.model-selector-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.2);
  z-index: 999;
}

/* Responsive */
@media (max-width: 768px) {
  .model-selector-trigger {
    min-width: 240px;
  }
  
  .model-dropdown {
    left: -20px;
    right: -20px;
  }
}
`;
