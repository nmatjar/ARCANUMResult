import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

/**
 * Error Page - Strona błędu dla ARCĀNUM Results Portal
 */
export const ErrorPage = ({ error, onRetry, onGoHome }) => {
  const { t } = useTranslation();
  return (
    <div className="arcanum-error-page">
      <div className="error-container">
        {/* ARCĀNUM Logo */}
        <motion.div 
          className="error-logo"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="error-brand-title">ARCĀNUM</h1>
          <div className="error-brand-subtitle">心钥</div>
        </motion.div>

        {/* Error Icon */}
        <motion.div 
          className="error-icon-container"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="error-icon">⚠️</div>
        </motion.div>

        {/* Error Message */}
        <motion.div 
          className="error-content"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <h2>{t('errorTitle')}</h2>
          <p className="error-message">{error}</p>
          
          <div className="error-suggestions">
            <h3>{t('errorCauses')}</h3>
            <ul>
              <li>{t('errorCause1')}</li>
              <li>{t('errorCause2')}</li>
              <li>{t('errorCause3')}</li>
              <li>{t('errorCause4')}</li>
            </ul>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          className="error-actions"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <button 
            className="retry-button primary"
            onClick={onRetry}
          >
            <span>{t('retry')}</span>
            <div className="button-glow" />
          </button>
          
          <button 
            className="home-button secondary"
            onClick={onGoHome}
          >
            {t('goHome')}
          </button>
        </motion.div>

        {/* Support Info */}
        <motion.div 
          className="error-support"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <p>
            {t('supportInfo')}
          </p>
          <div className="support-contact">
            <span>📧 support@arcanum.ai</span>
          </div>
        </motion.div>

        {/* Floating Elements */}
        <div className="error-floating-elements">
          <motion.div 
            className="float-element error-element-1"
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="float-element error-element-2"
            animate={{ 
              y: [0, -15, 0],
              rotate: [0, -3, 0]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
        </div>
      </div>
    </div>
  );
};

ErrorPage.propTypes = {
  error: PropTypes.string,
  onRetry: PropTypes.func,
  onGoHome: PropTypes.func,
};

// Dodaj style do CSS
const errorStyles = `
.arcanum-error-page {
  min-height: 100vh;
  background: var(--arcanum-gradient-hero);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--arcanum-spacing-lg);
  position: relative;
}

.arcanum-error-page::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 80%, rgba(255,107,107,0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(212,175,55,0.1) 0%, transparent 50%);
  pointer-events: none;
  z-index: -1;
}

.error-container {
  text-align: center;
  max-width: 600px;
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-radius: var(--arcanum-radius-xl);
  padding: var(--arcanum-spacing-2xl);
  border: 1px solid rgba(255, 107, 107, 0.3);
  position: relative;
  overflow: hidden;
}

.error-container::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,107,107,0.1), transparent);
  opacity: 0.3;
  animation: rotate 20s linear infinite;
  pointer-events: none;
}

.error-logo {
  margin-bottom: var(--arcanum-spacing-xl);
  position: relative;
  z-index: 2;
}

.error-brand-title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  color: var(--arcanum-swiss-gold);
  letter-spacing: 0.1em;
  margin-bottom: var(--arcanum-spacing-xs);
  text-shadow: 0 0 30px rgba(212,175,55,0.5);
  font-family: var(--arcanum-font-display);
}

.error-brand-subtitle {
  font-size: clamp(1rem, 2.5vw, 1.5rem);
  color: var(--arcanum-premium-silver);
  font-weight: 300;
}

.error-icon-container {
  margin-bottom: var(--arcanum-spacing-lg);
  position: relative;
  z-index: 2;
}

.error-icon {
  font-size: 4rem;
  margin-bottom: var(--arcanum-spacing-sm);
  filter: drop-shadow(0 0 20px rgba(255,107,107,0.5));
}

.error-content {
  margin-bottom: var(--arcanum-spacing-xl);
  position: relative;
  z-index: 2;
}

.error-content h2 {
  color: #ff6b6b;
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: var(--arcanum-spacing-sm);
}

.error-message {
  color: rgba(255,255,255,0.9);
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: var(--arcanum-spacing-lg);
  padding: var(--arcanum-spacing-md);
  background: rgba(255,107,107,0.1);
  border-radius: var(--arcanum-radius-md);
  border: 1px solid rgba(255,107,107,0.2);
}

.error-suggestions {
  text-align: left;
  background: rgba(255,255,255,0.05);
  border-radius: var(--arcanum-radius-md);
  padding: var(--arcanum-spacing-lg);
  border: 1px solid rgba(255,255,255,0.1);
}

.error-suggestions h3 {
  color: var(--arcanum-swiss-gold);
  font-size: 1.1rem;
  margin-bottom: var(--arcanum-spacing-sm);
}

.error-suggestions ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.error-suggestions li {
  color: rgba(255,255,255,0.8);
  padding: var(--arcanum-spacing-xs) 0;
  position: relative;
  padding-left: var(--arcanum-spacing-lg);
}

.error-suggestions li::before {
  content: '•';
  color: var(--arcanum-swiss-gold);
  position: absolute;
  left: 0;
  font-weight: bold;
}

.error-actions {
  display: flex;
  gap: var(--arcanum-spacing-md);
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: var(--arcanum-spacing-xl);
  position: relative;
  z-index: 2;
}

.retry-button, .home-button {
  border: none;
  border-radius: var(--arcanum-radius-md);
  padding: var(--arcanum-spacing-md) var(--arcanum-spacing-xl);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--arcanum-transition-normal);
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  min-width: 180px;
}

.retry-button.primary {
  background: linear-gradient(135deg, #ff6b6b, #ee5a52);
  color: white;
  box-shadow: var(--arcanum-shadow-md);
}

.retry-button.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(255,107,107,0.4);
}

.home-button.secondary {
  background: rgba(255,255,255,0.1);
  color: var(--arcanum-pearl-white);
  border: 1px solid rgba(255,255,255,0.3);
}

.home-button.secondary:hover {
  background: rgba(255,255,255,0.2);
  border-color: var(--arcanum-swiss-gold);
  transform: translateY(-2px);
}

.button-glow {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  transition: left 0.5s ease;
}

.retry-button:hover .button-glow {
  left: 100%;
}

.error-support {
  color: rgba(255,255,255,0.7);
  font-size: 0.9rem;
  position: relative;
  z-index: 2;
}

.support-contact {
  margin-top: var(--arcanum-spacing-sm);
  padding: var(--arcanum-spacing-sm);
  background: rgba(255,255,255,0.05);
  border-radius: var(--arcanum-radius-sm);
  border: 1px solid rgba(212,175,55,0.2);
}

.support-contact span {
  color: var(--arcanum-swiss-gold);
  font-weight: 500;
}

.error-floating-elements {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
}

.float-element {
  position: absolute;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,107,107,0.2), transparent);
  opacity: 0.3;
}

.error-element-1 {
  top: 15%;
  right: 10%;
  width: 100px;
  height: 100px;
}

.error-element-2 {
  bottom: 20%;
  left: 5%;
  width: 60px;
  height: 60px;
}

@media (max-width: 768px) {
  .error-container {
    padding: var(--arcanum-spacing-lg);
    margin: var(--arcanum-spacing-sm);
  }
  
  .error-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .retry-button, .home-button {
    width: 100%;
    max-width: 280px;
  }
  
  .error-suggestions {
    text-align: center;
  }
  
  .error-suggestions ul {
    text-align: left;
    display: inline-block;
  }
}

@media (max-width: 480px) {
  .error-brand-title {
    font-size: 2rem;
  }
  
  .error-content h2 {
    font-size: 1.5rem;
  }
  
  .error-message {
    font-size: 1rem;
  }
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = errorStyles;
  document.head.appendChild(styleSheet);
}
