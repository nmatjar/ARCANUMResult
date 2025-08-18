import { motion } from 'framer-motion';

/**
 * Advanced Analytics - Poziom 3 ARCĀNUM
 * Zaawansowane analizy i wzorce behawioralne
 */
export const AdvancedAnalytics = ({ data, loading, onLoad, onLoadNext, onRetry }) => {
  // Auto-load jeśli nie ma danych
  if (!data && !loading && onLoad) {
    onLoad();
  }

  if (loading) {
    return <AdvancedAnalyticsSkeleton />;
  }

  if (!data || !data.success) {
    return (
      <AdvancedAnalyticsError 
        error={data?.error || 'Błąd ładowania danych'} 
        onRetry={onRetry} 
      />
    );
  }

  const { content } = data;
  const {
    behavioralPatterns = [],
    cognitiveProfile = {},
    performanceMetrics = {},
    sections = {}
  } = content || {};

  return (
    <motion.section 
      className="advanced-analytics"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Header */}
      <motion.div 
        className="section-header"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <h2 className="section-title">Zaawansowane Analizy</h2>
        <p className="section-subtitle">
          Głęboka analiza wzorców behawioralnych i kognitywnych
        </p>
      </motion.div>

      {/* Cognitive Profile */}
      <motion.div 
        className="cognitive-profile"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <h3>Profil Kognitywny</h3>
        <div className="cognitive-grid">
          <div className="cognitive-item">
            <span className="cognitive-label">Styl Przetwarzania</span>
            <span className="cognitive-value">{cognitiveProfile.processingStyle || 'Analityczny'}</span>
          </div>
          <div className="cognitive-item">
            <span className="cognitive-label">Preferowana Złożoność</span>
            <span className="cognitive-value">{cognitiveProfile.complexity || 'Wysoka'}</span>
          </div>
          <div className="cognitive-item">
            <span className="cognitive-label">Tempo Decyzyjne</span>
            <span className="cognitive-value">{cognitiveProfile.decisionSpeed || 'Przemyślane'}</span>
          </div>
          <div className="cognitive-item">
            <span className="cognitive-label">Orientacja Czasowa</span>
            <span className="cognitive-value">{cognitiveProfile.timeOrientation || 'Długoterminowa'}</span>
          </div>
        </div>
      </motion.div>

      {/* Behavioral Patterns */}
      <div className="patterns-section">
        <h3>Wzorce Behawioralne</h3>
        <div className="patterns-grid">
          {behavioralPatterns.length > 0 ? (
            behavioralPatterns.map((pattern, index) => (
              <motion.div
                key={index}
                className="pattern-card"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 + (index * 0.1), duration: 0.6 }}
              >
                <div className="pattern-header">
                  <h4>{pattern.name}</h4>
                  <div className="pattern-strength">
                    <span className="strength-label">Siła wzorca:</span>
                    <div className="strength-indicator">
                      <motion.div 
                        className="strength-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${pattern.strength}%` }}
                        transition={{ delay: 1 + (index * 0.1), duration: 1 }}
                      />
                    </div>
                    <span className="strength-value">{pattern.strength}%</span>
                  </div>
                </div>
                <p className="pattern-description">{pattern.description}</p>
                <div className="pattern-implications">
                  <h5>Implikacje:</h5>
                  <ul>
                    {pattern.implications?.map((implication, i) => (
                      <li key={i}>{implication}</li>
                    )) || []}
                  </ul>
                </div>
              </motion.div>
            ))
          ) : (
            <DefaultPatterns />
          )}
        </div>
      </div>

      {/* Performance Metrics */}
      {performanceMetrics && Object.keys(performanceMetrics).length > 0 && (
        <motion.div 
          className="performance-metrics"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <h3>Metryki Wydajności</h3>
          <div className="metrics-content">
            {sections['Performance Analysis'] || 'Analiza kluczowych wskaźników wydajności...'}
          </div>
        </motion.div>
      )}

      {/* Advanced Insights */}
      {sections['Advanced Insights'] && (
        <motion.div 
          className="advanced-insights"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
        >
          <h3>Zaawansowane Insights</h3>
          <div className="insights-content">
            {sections['Advanced Insights']}
          </div>
        </motion.div>
      )}

      {/* Call to Action */}
      <motion.div 
        className="level-cta"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.6 }}
      >
        <p className="cta-text">
          Odkryj ukryte skarby swojej osobowości
        </p>
        <button 
          className="cta-button"
          onClick={onLoadNext}
        >
          <span>Przejdź do Ukrytych Skarbów</span>
          <div className="button-glow" />
        </button>
      </motion.div>
    </motion.section>
  );
};

/**
 * Domyślne wzorce gdy brak danych
 */
const DefaultPatterns = () => {
  const defaultPatterns = [
    {
      name: 'Wzorzec Innowacyjny',
      strength: 87,
      description: 'Silna tendencja do poszukiwania nowych rozwiązań i kreatywnego podejścia do problemów.',
      implications: [
        'Naturalny talent do generowania pomysłów',
        'Skłonność do kwestionowania status quo',
        'Potrzeba środowiska wspierającego eksperymenty'
      ]
    },
    {
      name: 'Wzorzec Systemowy',
      strength: 82,
      description: 'Zdolność do postrzegania złożonych powiązań i myślenia w kategoriach systemów.',
      implications: [
        'Doskonałe rozumienie zależności',
        'Umiejętność przewidywania konsekwencji',
        'Naturalna orientacja na długoterminowe efekty'
      ]
    },
    {
      name: 'Wzorzec Adaptacyjny',
      strength: 79,
      description: 'Elastyczność w dostosowywaniu się do zmieniających się warunków i wymagań.',
      implications: [
        'Szybka reakcja na zmiany',
        'Komfort w niepewnych sytuacjach',
        'Umiejętność uczenia się z doświadczeń'
      ]
    },
    {
      name: 'Wzorzec Przywódczy',
      strength: 85,
      description: 'Naturalne predyspozycje do przewodzenia i inspirowania innych.',
      implications: [
        'Silna obecność i charyzma',
        'Umiejętność motywowania zespołów',
        'Naturalna skłonność do podejmowania odpowiedzialności'
      ]
    }
  ];

  return (
    <>
      {defaultPatterns.map((pattern, index) => (
        <motion.div
          key={index}
          className="pattern-card"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6 + (index * 0.1), duration: 0.6 }}
        >
          <div className="pattern-header">
            <h4>{pattern.name}</h4>
            <div className="pattern-strength">
              <span className="strength-label">Siła wzorca:</span>
              <div className="strength-indicator">
                <motion.div 
                  className="strength-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${pattern.strength}%` }}
                  transition={{ delay: 1 + (index * 0.1), duration: 1 }}
                />
              </div>
              <span className="strength-value">{pattern.strength}%</span>
            </div>
          </div>
          <p className="pattern-description">{pattern.description}</p>
          <div className="pattern-implications">
            <h5>Implikacje:</h5>
            <ul>
              {pattern.implications.map((implication, i) => (
                <li key={i}>{implication}</li>
              ))}
            </ul>
          </div>
        </motion.div>
      ))}
    </>
  );
};

/**
 * Skeleton loader dla Advanced Analytics
 */
const AdvancedAnalyticsSkeleton = () => (
  <div className="advanced-analytics skeleton">
    <div className="section-header">
      <div className="skeleton-title" />
      <div className="skeleton-subtitle" />
    </div>
    
    <div className="cognitive-profile">
      <div className="skeleton-line" />
      <div className="cognitive-grid">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="cognitive-item skeleton-item">
            <div className="skeleton-line short" />
            <div className="skeleton-line" />
          </div>
        ))}
      </div>
    </div>
    
    <div className="patterns-section">
      <div className="skeleton-line" />
      <div className="patterns-grid">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="pattern-card skeleton-card">
            <div className="pattern-header">
              <div className="skeleton-line" />
              <div className="skeleton-strength">
                <div className="skeleton-line short" />
                <div className="skeleton-bar" />
              </div>
            </div>
            <div className="skeleton-line" />
            <div className="skeleton-line" />
            <div className="skeleton-line short" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

/**
 * Error state dla Advanced Analytics
 */
const AdvancedAnalyticsError = ({ error, onRetry }) => (
  <div className="advanced-analytics error">
    <div className="error-content">
      <div className="error-icon">⚠️</div>
      <h3>Błąd ładowania Zaawansowanych Analiz</h3>
      <p>{error}</p>
      <button className="retry-button" onClick={onRetry}>
        Spróbuj ponownie
      </button>
    </div>
  </div>
);
