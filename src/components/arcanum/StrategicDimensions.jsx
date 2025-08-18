import { motion } from 'framer-motion';

/**
 * Strategic Dimensions - Poziom 2 ARCĀNUM
 * Głęboka analiza strategicznych wymiarów osobowości
 */
export const StrategicDimensions = ({ data, loading, onLoadNext, onRetry }) => {
  if (loading) {
    return <StrategicDimensionsSkeleton />;
  }

  if (!data || !data.success) {
    return (
      <StrategicDimensionsError 
        error={data?.error || 'Błąd ładowania danych'} 
        onRetry={onRetry} 
      />
    );
  }

  const { content } = data;
  const {
    strategicProfile = {},
    dimensionAnalysis = [],
    leadershipMatrix = {},
    sections = {}
  } = content || {};

  return (
    <motion.section 
      className="strategic-dimensions"
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
        <h2 className="section-title">Strategiczne Wymiary</h2>
        <p className="section-subtitle">
          Analiza kluczowych wymiarów strategicznego myślenia i działania
        </p>
      </motion.div>

      {/* Strategic Profile Overview */}
      <motion.div 
        className="strategic-overview"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <h3>Profil Strategiczny</h3>
        <div className="profile-metrics">
          <div className="metric-item">
            <span className="metric-label">Orientacja Strategiczna</span>
            <span className="metric-value">{strategicProfile.orientation || 'Długoterminowa'}</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Styl Podejmowania Decyzji</span>
            <span className="metric-value">{strategicProfile.decisionStyle || 'Analityczny'}</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Podejście do Ryzyka</span>
            <span className="metric-value">{strategicProfile.riskApproach || 'Kalkulowane'}</span>
          </div>
        </div>
      </motion.div>

      {/* Dimension Analysis */}
      <div className="dimensions-grid">
        {dimensionAnalysis.length > 0 ? (
          dimensionAnalysis.map((dimension, index) => (
            <motion.div
              key={index}
              className="dimension-card"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 + (index * 0.1), duration: 0.6 }}
            >
              <div className="dimension-header">
                <h4>{dimension.name}</h4>
                <div className="dimension-score">
                  <span className="score-value">{dimension.score}/100</span>
                  <div className="score-bar">
                    <motion.div 
                      className="score-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${dimension.score}%` }}
                      transition={{ delay: 1 + (index * 0.1), duration: 1 }}
                    />
                  </div>
                </div>
              </div>
              <p className="dimension-description">{dimension.description}</p>
              <div className="dimension-insights">
                <h5>Kluczowe Insights:</h5>
                <ul>
                  {dimension.insights?.map((insight, i) => (
                    <li key={i}>{insight}</li>
                  )) || []}
                </ul>
              </div>
            </motion.div>
          ))
        ) : (
          <DefaultDimensions />
        )}
      </div>

      {/* Leadership Matrix */}
      {leadershipMatrix && Object.keys(leadershipMatrix).length > 0 && (
        <motion.div 
          className="leadership-matrix"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <h3>Matryca Przywództwa</h3>
          <div className="matrix-content">
            {sections['Leadership Matrix'] || 'Analiza stylu przywództwa w kontekście strategicznych wymiarów...'}
          </div>
        </motion.div>
      )}

      {/* Strategic Recommendations */}
      {sections['Strategic Recommendations'] && (
        <motion.div 
          className="strategic-recommendations"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
        >
          <h3>Rekomendacje Strategiczne</h3>
          <div className="recommendations-content">
            {sections['Strategic Recommendations']}
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
          Gotowy na głębszą analizę zaawansowanych wzorców?
        </p>
        <button 
          className="cta-button"
          onClick={onLoadNext}
        >
          <span>Przejdź do Zaawansowanych Analiz</span>
          <div className="button-glow" />
        </button>
      </motion.div>
    </motion.section>
  );
};

/**
 * Domyślne wymiary gdy brak danych
 */
const DefaultDimensions = () => {
  const defaultDimensions = [
    {
      name: 'Wizja Strategiczna',
      score: 85,
      description: 'Zdolność do tworzenia i komunikowania długoterminowej wizji organizacyjnej.',
      insights: [
        'Silna orientacja na przyszłość',
        'Umiejętność inspirowania innych',
        'Myślenie systemowe'
      ]
    },
    {
      name: 'Analiza Konkurencyjna',
      score: 78,
      description: 'Kompetencje w zakresie analizy otoczenia konkurencyjnego i identyfikacji przewag.',
      insights: [
        'Dogłębna analiza rynku',
        'Identyfikacja trendów',
        'Przewidywanie ruchów konkurencji'
      ]
    },
    {
      name: 'Adaptacyjność Strategiczna',
      score: 82,
      description: 'Elastyczność w dostosowywaniu strategii do zmieniających się warunków.',
      insights: [
        'Szybka reakcja na zmiany',
        'Elastyczne planowanie',
        'Uczenie się z niepowodzeń'
      ]
    },
    {
      name: 'Wykonanie Strategii',
      score: 88,
      description: 'Skuteczność w implementacji i realizacji strategicznych inicjatyw.',
      insights: [
        'Doskonała organizacja',
        'Skuteczne zarządzanie zasobami',
        'Monitorowanie postępów'
      ]
    }
  ];

  return (
    <>
      {defaultDimensions.map((dimension, index) => (
        <motion.div
          key={index}
          className="dimension-card"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 + (index * 0.1), duration: 0.6 }}
        >
          <div className="dimension-header">
            <h4>{dimension.name}</h4>
            <div className="dimension-score">
              <span className="score-value">{dimension.score}/100</span>
              <div className="score-bar">
                <motion.div 
                  className="score-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${dimension.score}%` }}
                  transition={{ delay: 1 + (index * 0.1), duration: 1 }}
                />
              </div>
            </div>
          </div>
          <p className="dimension-description">{dimension.description}</p>
          <div className="dimension-insights">
            <h5>Kluczowe Insights:</h5>
            <ul>
              {dimension.insights.map((insight, i) => (
                <li key={i}>{insight}</li>
              ))}
            </ul>
          </div>
        </motion.div>
      ))}
    </>
  );
};

/**
 * Skeleton loader dla Strategic Dimensions
 */
const StrategicDimensionsSkeleton = () => (
  <div className="strategic-dimensions skeleton">
    <div className="section-header">
      <div className="skeleton-title" />
      <div className="skeleton-subtitle" />
    </div>
    
    <div className="strategic-overview">
      <div className="skeleton-line" />
      <div className="profile-metrics">
        {[1, 2, 3].map(i => (
          <div key={i} className="metric-item skeleton-metric">
            <div className="skeleton-line short" />
            <div className="skeleton-line" />
          </div>
        ))}
      </div>
    </div>
    
    <div className="dimensions-grid">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="dimension-card skeleton-card">
          <div className="dimension-header">
            <div className="skeleton-line" />
            <div className="skeleton-score">
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
);

/**
 * Error state dla Strategic Dimensions
 */
const StrategicDimensionsError = ({ error, onRetry }) => (
  <div className="strategic-dimensions error">
    <div className="error-content">
      <div className="error-icon">⚠️</div>
      <h3>Błąd ładowania Strategicznych Wymiarów</h3>
      <p>{error}</p>
      <button className="retry-button" onClick={onRetry}>
        Spróbuj ponownie
      </button>
    </div>
  </div>
);
