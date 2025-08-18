import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * Hero Dashboard - Poziom 1 ARCĀNUM
 * Natychmiastowy WOW effect z kluczowymi metrykami
 */
export const HeroDashboard = ({ data, loading, onExploreMore, onRetry }) => {
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimationComplete(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <HeroDashboardSkeleton />;
  }

  if (!data || !data.success) {
    return (
      <HeroDashboardError 
        error={data?.error || 'Błąd ładowania danych'} 
        onRetry={onRetry} 
      />
    );
  }

  const { content } = data;
  const {
    dominantArchetype = 'Strategiczny Lider',
    leadershipIndex = 85,
    psychometricProfile = [],
    sections = {}
  } = content || {};

  return (
    <motion.section 
      className="hero-dashboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* ARCĀNUM Branding */}
      <motion.div 
        className="arcanum-brand"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <h1 className="brand-title">ARCĀNUM</h1>
        <div className="brand-subtitle">心钥</div>
        <p className="brand-tagline">Advanced Psychometric Analysis</p>
      </motion.div>

      {/* Główne metryki */}
      <div className="hero-metrics">
        {/* Dominujący Archetyp */}
        <motion.div 
          className="metric-card primary"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="metric-icon">🎯</div>
          <div className="metric-content">
            <h3>Dominujący Archetyp</h3>
            <div className="metric-value">{dominantArchetype}</div>
            <div className="metric-description">
              Naturalny wzorzec przywództwa i podejmowania decyzji
            </div>
          </div>
        </motion.div>

        {/* Potencjał Przywódczy */}
        <motion.div 
          className="metric-card secondary"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <div className="metric-icon">👑</div>
          <div className="metric-content">
            <h3>Potencjał Przywódczy</h3>
            <div className="metric-value-container">
              <div className="metric-value">{leadershipIndex}/100</div>
              <div className="metric-bar">
                <motion.div 
                  className="metric-fill" 
                  initial={{ width: 0 }}
                  animate={{ width: `${leadershipIndex}%` }}
                  transition={{ delay: 1, duration: 1.5, ease: "easeOut" }}
                />
              </div>
            </div>
            <div className="metric-description">
              {leadershipIndex >= 80 ? 'Wysoki potencjał przywódczy' :
               leadershipIndex >= 60 ? 'Średni potencjał przywódczy' :
               'Rozwijający się potencjał przywódczy'}
            </div>
          </div>
        </motion.div>

        {/* Profil 360° */}
        <motion.div 
          className="metric-card tertiary"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="metric-icon">🧠</div>
          <div className="metric-content">
            <h3>Psychometryczny Profil 360°</h3>
            <div className="profile-grid">
              {psychometricProfile.length > 0 ? (
                psychometricProfile.slice(0, 5).map((item, index) => (
                  <motion.div 
                    key={index} 
                    className="profile-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 + (index * 0.1), duration: 0.4 }}
                  >
                    <span className="profile-label">{item.label}</span>
                    <span className="profile-value">{item.value}</span>
                  </motion.div>
                ))
              ) : (
                <DefaultProfileItems />
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Strategic Highlights */}
      {sections['Strategic Highlights'] && (
        <motion.div 
          className="strategic-highlights"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
        >
          <h3>Kluczowe Insights</h3>
          <div className="highlights-content">
            {sections['Strategic Highlights']}
          </div>
        </motion.div>
      )}

      {/* Call to Action */}
      <motion.div 
        className="hero-cta"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2, duration: 0.6 }}
      >
        <p className="cta-text">
          Odkryj pełną głębię analizy psychometrycznej
        </p>
        <button 
          className="cta-button"
          onClick={onExploreMore}
          disabled={!animationComplete}
        >
          <span>Eksploruj Strategiczne Wymiary</span>
          <div className="button-glow" />
        </button>
      </motion.div>

      {/* Floating Elements */}
      <div className="floating-elements">
        <motion.div 
          className="float-element element-1"
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
          className="float-element element-2"
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
    </motion.section>
  );
};

/**
 * Skeleton loader dla Hero Dashboard
 */
const HeroDashboardSkeleton = () => (
  <div className="hero-dashboard skeleton">
    <div className="arcanum-brand">
      <div className="skeleton-title" />
      <div className="skeleton-subtitle" />
      <div className="skeleton-tagline" />
    </div>
    
    <div className="hero-metrics">
      {[1, 2, 3].map(i => (
        <div key={i} className="metric-card skeleton-card">
          <div className="skeleton-icon" />
          <div className="skeleton-content">
            <div className="skeleton-line" />
            <div className="skeleton-line short" />
          </div>
        </div>
      ))}
    </div>
    
    <div className="skeleton-cta">
      <div className="skeleton-line" />
      <div className="skeleton-button" />
    </div>
  </div>
);

/**
 * Error state dla Hero Dashboard
 */
const HeroDashboardError = ({ error, onRetry }) => (
  <div className="hero-dashboard error">
    <div className="error-content">
      <div className="error-icon">⚠️</div>
      <h3>Błąd ładowania analizy</h3>
      <p>{error}</p>
      <button className="retry-button" onClick={onRetry}>
        Spróbuj ponownie
      </button>
    </div>
  </div>
);

/**
 * Domyślne elementy profilu gdy brak danych
 */
const DefaultProfileItems = () => (
  <>
    <div className="profile-item">
      <span className="profile-label">Styl Przywództwa</span>
      <span className="profile-value">Transformacyjny</span>
    </div>
    <div className="profile-item">
      <span className="profile-label">Motywatory</span>
      <span className="profile-value">Innowacja & Wzrost</span>
    </div>
    <div className="profile-item">
      <span className="profile-label">Komunikacja</span>
      <span className="profile-value">Strategiczna</span>
    </div>
    <div className="profile-item">
      <span className="profile-label">Podejmowanie Decyzji</span>
      <span className="profile-value">Analityczne</span>
    </div>
    <div className="profile-item">
      <span className="profile-label">Fit Organizacyjny</span>
      <span className="profile-value">Dynamiczne środowiska</span>
    </div>
  </>
);
