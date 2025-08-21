import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { useNavigate, useLocation } from 'react-router-dom';
import LanguageSwitcher from '../LanguageSwitcher';
import { useTranslation } from 'react-i18next';

/**
 * ARCĀNUM Header - Uproszczony nagłówek dla widoku katalogu
 */
export const ArcanumHeader = ({ clientData }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { path: '/', label: 'Katalog', icon: '📋' },
    { path: '/soul-mirror', label: 'Lustro Duszy', icon: '🔮' }
  ];

  return (
    <motion.header 
      className="arcanum-header"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="header-container">
        {/* Logo i branding */}
        <div className="header-brand">
          <h1 className="header-title">ARCĀNUM</h1>
          <span className="header-subtitle">心钥</span>
        </div>

        {/* Nawigacja */}
        <div className="header-navigation">
          {navigationItems.map((item) => (
            <motion.button
              key={item.path}
              onClick={() => navigate(item.path)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`nav-btn ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </motion.button>
          ))}
        </div>

        <LanguageSwitcher />

        {/* Informacje o kliencie */}
        {clientData && (
          <div className="header-client-info">
            <div className="client-name">{clientData.name || t('client')}</div>
            {clientData.current_job && (
              <div className="client-company">{clientData.current_job}</div>
            )}
          </div>
        )}
      </div>
    </motion.header>
  );
};

ArcanumHeader.propTypes = {
  clientData: PropTypes.shape({
    name: PropTypes.string,
    current_job: PropTypes.string
  })
};

// Dodaj style do CSS
const headerStyles = `
.arcanum-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(27, 41, 81, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(212, 175, 55, 0.2);
  padding: var(--arcanum-spacing-md) 0;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--arcanum-spacing-lg);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--arcanum-spacing-lg);
}

.header-brand {
  display: flex;
  align-items: center;
  gap: var(--arcanum-spacing-sm);
}

.header-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--arcanum-swiss-gold);
  letter-spacing: 0.1em;
  margin: 0;
  font-family: var(--arcanum-font-display);
  text-shadow: 0 0 20px rgba(212,175,55,0.3);
}

.header-subtitle {
  font-size: 1.2rem;
  color: var(--arcanum-premium-silver);
  font-weight: 300;
}

.header-client-info {
  text-align: center;
  flex: 1;
}

.client-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--arcanum-pearl-white);
  margin-bottom: 2px;
}

.client-company {
  font-size: 0.9rem;
  color: rgba(255,255,255,0.7);
}

.header-navigation {
  display: flex;
  align-items: center;
  gap: var(--arcanum-spacing-md);
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.nav-btn:hover {
  background: rgba(212, 175, 55, 0.2);
  border-color: rgba(212, 175, 55, 0.6);
  color: white;
}

.nav-btn.active {
  background: rgba(212, 175, 55, 0.3);
  border-color: var(--arcanum-swiss-gold);
  color: var(--arcanum-swiss-gold);
  box-shadow: 0 0 15px rgba(212, 175, 55, 0.3);
}

.nav-icon {
  font-size: 1.1rem;
}

.nav-label {
  font-size: 0.85rem;
}

.level-indicator {
  text-align: right;
}

.current-level {
  display: block;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--arcanum-swiss-gold);
}

.level-name {
  display: block;
  font-size: 0.9rem;
  color: rgba(255,255,255,0.7);
}

.level-nav {
  display: flex;
  gap: var(--arcanum-spacing-xs);
}

.level-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid rgba(212,175,55,0.3);
  background: rgba(255,255,255,0.1);
  color: var(--arcanum-swiss-gold);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--arcanum-transition-normal);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.level-btn:hover:not(:disabled) {
  border-color: var(--arcanum-swiss-gold);
  background: rgba(212,175,55,0.2);
  transform: scale(1.1);
}

.level-btn.active {
  border-color: var(--arcanum-swiss-gold);
  background: var(--arcanum-swiss-gold);
  color: var(--arcanum-midnight);
  box-shadow: 0 0 20px rgba(212,175,55,0.5);
}

.level-btn.available {
  border-color: var(--arcanum-forest-green);
  background: rgba(45,80,22,0.3);
}

.level-btn.locked {
  border-color: rgba(255,255,255,0.2);
  background: rgba(255,255,255,0.05);
  color: rgba(255,255,255,0.3);
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .header-container {
    flex-direction: column;
    gap: var(--arcanum-spacing-md);
    padding: 0 var(--arcanum-spacing-md);
  }
  
  .header-brand {
    order: 1;
  }
  
  .header-client-info {
    order: 2;
    flex: none;
  }
  
  .header-navigation {
    order: 3;
    flex-direction: column;
    gap: var(--arcanum-spacing-sm);
    width: 100%;
  }
  
  .level-indicator {
    text-align: center;
  }
  
  .level-nav {
    justify-content: center;
  }
  
  .header-title {
    font-size: 1.5rem;
  }
  
  .header-subtitle {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .level-btn {
    width: 35px;
    height: 35px;
    font-size: 0.9rem;
  }
  
  .level-nav {
    gap: 6px;
  }
  
  .header-container {
    padding: 0 var(--arcanum-spacing-sm);
  }
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = headerStyles;
  document.head.appendChild(styleSheet);
}
