import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

/**
 * ARCĀNUM Footer - Stopka dla Results Portal
 */
export const ArcanumFooter = ({ clientData }) => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer 
      className="arcanum-footer"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
    >
      <div className="footer-container">
        {/* Główna sekcja */}
        <div className="footer-main">
          {/* ARCĀNUM Branding */}
          <div className="footer-brand">
            <h3 className="footer-title">ARCĀNUM</h3>
            <div className="footer-subtitle">心钥</div>
            <p className="footer-tagline">
              Advanced Psychometric Analysis Platform
            </p>
          </div>

          {/* Informacje o sesji */}
          <div className="footer-session">
            <h4>{t('sessionInfo')}</h4>
            <div className="session-details">
              {clientData?.sessionInfo && (
                <>
                  <div className="session-item">
                    <span className="label">{t('analysisDate')}:</span>
                    <span className="value">
                      {new Date(clientData.sessionInfo.createdAt).toLocaleDateString('pl-PL')}
                    </span>
                  </div>
                  <div className="session-item">
                    <span className="label">{t('sessionId')}:</span>
                    <span className="value">{clientData.sessionInfo.id}</span>
                  </div>
                </>
              )}
              <div className="session-item">
                <span className="label">{t('generated')}:</span>
                <span className="value">
                  {new Date().toLocaleDateString('pl-PL')} {new Date().toLocaleTimeString('pl-PL')}
                </span>
              </div>
            </div>
          </div>

          {/* Kontakt i wsparcie */}
          <div className="footer-support">
            <h4>{t('support')}</h4>
            <div className="support-links">
              <a href="mailto:support@arcanum.ai" className="support-link">
                📧 support@arcanum.ai
              </a>
              <a href="https://arcanum.ai/help" className="support-link">
                📚 {t('helpCenter')}
              </a>
              <a href="https://arcanum.ai/privacy" className="support-link">
                🔒 {t('privacyPolicy')}
              </a>
              <a href="/prompt-catalog" className="support-link">
                📚 Katalog Promptów
              </a>
            </div>
          </div>
        </div>

        {/* Dolna sekcja */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>
              © {currentYear} ARCĀNUM. {t('copyright')}.
            </p>
            <p className="footer-disclaimer">
              {t('disclaimer')}.
            </p>
          </div>

          {/* Technologie */}
          <div className="footer-tech">
            <span className="tech-label">Powered by:</span>
            <div className="tech-stack">
              <span className="tech-item">Gemini AI</span>
              <span className="tech-item">React</span>
              <span className="tech-item">Airtable</span>
            </div>
          </div>
        </div>

        {/* Dekoracyjne elementy */}
        <div className="footer-decoration">
          <motion.div 
            className="decoration-line"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          />
          <div className="decoration-dots">
            {[...Array(5)].map((_, index) => (
              <motion.div
                key={index}
                className="decoration-dot"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  duration: 0.4, 
                  delay: 1 + (index * 0.1) 
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

ArcanumFooter.propTypes = {
  clientData: PropTypes.shape({
    sessionInfo: PropTypes.shape({
      createdAt: PropTypes.string,
      id: PropTypes.string,
    }),
  }),
};

// Dodaj style do CSS
const footerStyles = `
.arcanum-footer {
  background: rgba(15, 20, 25, 0.95);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(212, 175, 55, 0.2);
  margin-top: var(--arcanum-spacing-2xl);
  position: relative;
  overflow: hidden;
}

.arcanum-footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 10% 90%, rgba(212,175,55,0.05) 0%, transparent 50%),
    radial-gradient(circle at 90% 10%, rgba(45,80,22,0.05) 0%, transparent 50%);
  pointer-events: none;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--arcanum-spacing-2xl) var(--arcanum-spacing-lg);
  position: relative;
  z-index: 2;
}

.footer-main {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--arcanum-spacing-xl);
  margin-bottom: var(--arcanum-spacing-xl);
}

.footer-brand {
  text-align: center;
}

.footer-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--arcanum-swiss-gold);
  letter-spacing: 0.1em;
  margin-bottom: var(--arcanum-spacing-xs);
  font-family: var(--arcanum-font-display);
  text-shadow: 0 0 20px rgba(212,175,55,0.3);
}

.footer-subtitle {
  font-size: 1.3rem;
  color: var(--arcanum-premium-silver);
  font-weight: 300;
  margin-bottom: var(--arcanum-spacing-sm);
}

.footer-tagline {
  color: rgba(255,255,255,0.7);
  font-size: 0.9rem;
  font-weight: 300;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.footer-session, .footer-support {
  background: rgba(255,255,255,0.05);
  border-radius: var(--arcanum-radius-md);
  padding: var(--arcanum-spacing-lg);
  border: 1px solid rgba(255,255,255,0.1);
}

.footer-session h4, .footer-support h4 {
  color: var(--arcanum-swiss-gold);
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: var(--arcanum-spacing-md);
  text-align: center;
}

.session-details {
  display: flex;
  flex-direction: column;
  gap: var(--arcanum-spacing-sm);
}

.session-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--arcanum-spacing-xs) 0;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.session-item:last-child {
  border-bottom: none;
}

.session-item .label {
  color: rgba(255,255,255,0.7);
  font-size: 0.9rem;
}

.session-item .value {
  color: var(--arcanum-pearl-white);
  font-size: 0.9rem;
  font-weight: 500;
  text-align: right;
}

.support-links {
  display: flex;
  flex-direction: column;
  gap: var(--arcanum-spacing-sm);
}

.support-link {
  color: rgba(255,255,255,0.8);
  text-decoration: none;
  font-size: 0.9rem;
  padding: var(--arcanum-spacing-xs) var(--arcanum-spacing-sm);
  border-radius: var(--arcanum-radius-sm);
  transition: all var(--arcanum-transition-normal);
  text-align: center;
  border: 1px solid rgba(255,255,255,0.1);
}

.support-link:hover {
  color: var(--arcanum-swiss-gold);
  background: rgba(212,175,55,0.1);
  border-color: rgba(212,175,55,0.3);
  transform: translateY(-2px);
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--arcanum-spacing-lg);
  border-top: 1px solid rgba(255,255,255,0.1);
  gap: var(--arcanum-spacing-lg);
}

.footer-copyright {
  flex: 1;
}

.footer-copyright p {
  color: rgba(255,255,255,0.7);
  font-size: 0.9rem;
  margin-bottom: var(--arcanum-spacing-xs);
}

.footer-disclaimer {
  font-size: 0.8rem !important;
  color: rgba(255,255,255,0.5) !important;
  font-style: italic;
}

.footer-tech {
  display: flex;
  align-items: center;
  gap: var(--arcanum-spacing-sm);
}

.tech-label {
  color: rgba(255,255,255,0.6);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.tech-stack {
  display: flex;
  gap: var(--arcanum-spacing-xs);
}

.tech-item {
  background: rgba(212,175,55,0.1);
  color: var(--arcanum-swiss-gold);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  border: 1px solid rgba(212,175,55,0.2);
}

.footer-decoration {
  margin-top: var(--arcanum-spacing-lg);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--arcanum-spacing-sm);
}

.decoration-line {
  width: 200px;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--arcanum-swiss-gold), transparent);
  transform-origin: center;
}

.decoration-dots {
  display: flex;
  gap: var(--arcanum-spacing-xs);
}

.decoration-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--arcanum-swiss-gold);
  box-shadow: 0 0 10px rgba(212,175,55,0.5);
}

@media (max-width: 768px) {
  .footer-main {
    grid-template-columns: 1fr;
    gap: var(--arcanum-spacing-lg);
  }
  
  .footer-bottom {
    flex-direction: column;
    text-align: center;
    gap: var(--arcanum-spacing-md);
  }
  
  .footer-tech {
    flex-direction: column;
    gap: var(--arcanum-spacing-xs);
  }
  
  .tech-stack {
    justify-content: center;
  }
  
  .session-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .session-item .value {
    text-align: left;
  }
}

@media (max-width: 480px) {
  .footer-container {
    padding: var(--arcanum-spacing-lg) var(--arcanum-spacing-md);
  }
  
  .footer-title {
    font-size: 1.5rem;
  }
  
  .footer-subtitle {
    font-size: 1rem;
  }
  
  .footer-session, .footer-support {
    padding: var(--arcanum-spacing-md);
  }
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = footerStyles;
  document.head.appendChild(styleSheet);
}
