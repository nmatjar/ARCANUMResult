import { motion } from 'framer-motion';

/**
 * Academic Compass - Poziom 5 ARCĀNUM
 * Ostateczna analiza i rekomendacje akademickie/zawodowe
 */
export const AcademicCompass = ({ data, loading, onLoad, onRetry }) => {
  // Auto-load jeśli nie ma danych
  if (!data && !loading && onLoad) {
    onLoad();
  }

  if (loading) {
    return <AcademicCompassSkeleton />;
  }

  if (!data || !data.success) {
    return (
      <AcademicCompassError 
        error={data?.error || 'Błąd ładowania danych'} 
        onRetry={onRetry} 
      />
    );
  }

  const { content } = data;
  const {
    academicRecommendations = [],
    careerPaths = [],
    developmentPlan = {},
    sections = {}
  } = content || {};

  return (
    <motion.section 
      className="academic-compass"
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
        <h2 className="section-title">Kompas Akademicki</h2>
        <p className="section-subtitle">
          Ostateczne rekomendacje dla Twojej ścieżki rozwoju
        </p>
      </motion.div>

      {/* Academic Recommendations */}
      <div className="recommendations-section">
        <motion.h3
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          🎓 Rekomendacje Akademickie
        </motion.h3>
        <div className="recommendations-grid">
          {academicRecommendations.length > 0 ? (
            academicRecommendations.map((recommendation, index) => (
              <motion.div
                key={index}
                className="recommendation-card"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 + (index * 0.1), duration: 0.6 }}
              >
                <div className="recommendation-header">
                  <div className="recommendation-icon">🎓</div>
                  <h4>{recommendation.title}</h4>
                  <div className="recommendation-priority">
                    <span className={`priority-badge ${recommendation.priority?.toLowerCase()}`}>
                      {recommendation.priority || 'Wysoki'}
                    </span>
                  </div>
                </div>
                <p className="recommendation-description">{recommendation.description}</p>
                <div className="recommendation-details">
                  <div className="detail-item">
                    <span className="detail-label">Obszar:</span>
                    <span className="detail-value">{recommendation.area || 'Rozwój zawodowy'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Czas realizacji:</span>
                    <span className="detail-value">{recommendation.timeframe || '6-12 miesięcy'}</span>
                  </div>
                </div>
                <div className="recommendation-actions">
                  <h5>Konkretne kroki:</h5>
                  <ul>
                    {recommendation.actions?.map((action, i) => (
                      <li key={i}>{action}</li>
                    )) || []}
                  </ul>
                </div>
              </motion.div>
            ))
          ) : (
            <DefaultRecommendations />
          )}
        </div>
      </div>

      {/* Career Paths */}
      <div className="career-paths-section">
        <motion.h3
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          🚀 Ścieżki Kariery
        </motion.h3>
        <div className="career-paths-grid">
          {careerPaths.length > 0 ? (
            careerPaths.map((path, index) => (
              <motion.div
                key={index}
                className="career-path-card"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.4 + (index * 0.1), duration: 0.6 }}
              >
                <div className="path-header">
                  <div className="path-icon">🚀</div>
                  <h4>{path.title}</h4>
                  <div className="path-match">
                    <span className="match-label">Dopasowanie:</span>
                    <div className="match-bar">
                      <motion.div 
                        className="match-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${path.match}%` }}
                        transition={{ delay: 2 + (index * 0.1), duration: 1 }}
                      />
                    </div>
                    <span className="match-value">{path.match}%</span>
                  </div>
                </div>
                <p className="path-description">{path.description}</p>
                <div className="path-requirements">
                  <h5>Kluczowe wymagania:</h5>
                  <div className="requirements-list">
                    {path.requirements?.map((req, i) => (
                      <span key={i} className="requirement-tag">{req}</span>
                    )) || []}
                  </div>
                </div>
                <div className="path-growth">
                  <h5>Potencjał wzrostu:</h5>
                  <p>{path.growthPotential || 'Wysoki potencjał rozwoju w dynamicznie rozwijającej się branży.'}</p>
                </div>
              </motion.div>
            ))
          ) : (
            <DefaultCareerPaths />
          )}
        </div>
      </div>

      {/* Development Plan */}
      {developmentPlan && Object.keys(developmentPlan).length > 0 && (
        <motion.div 
          className="development-plan"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 2.4, duration: 0.6 }}
        >
          <h3>📋 Plan Rozwoju</h3>
          <div className="plan-content">
            {sections['Development Plan'] || 'Spersonalizowany plan rozwoju oparty na analizie ARCĀNUM...'}
          </div>
        </motion.div>
      )}

      {/* Final Summary */}
      {sections['Final Summary'] && (
        <motion.div 
          className="final-summary"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 2.6, duration: 0.6 }}
        >
          <h3>🎯 Podsumowanie Finalne</h3>
          <div className="summary-content">
            {sections['Final Summary']}
          </div>
        </motion.div>
      )}

      {/* Completion Message */}
      <motion.div 
        className="completion-message"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 2.8, duration: 0.6 }}
      >
        <div className="completion-icon">🏆</div>
        <h3>Gratulacje!</h3>
        <p>
          Ukończyłeś pełną analizę ARCĀNUM. Wykorzystaj te insights do budowania 
          swojej wyjątkowej ścieżki rozwoju.
        </p>
        <div className="completion-actions">
          <button className="download-button">
            📄 Pobierz pełny raport
          </button>
          <button className="share-button">
            📤 Udostępnij wyniki
          </button>
        </div>
      </motion.div>
    </motion.section>
  );
};

/**
 * Domyślne rekomendacje gdy brak danych
 */
const DefaultRecommendations = () => {
  const defaultRecommendations = [
    {
      title: 'Rozwój Kompetencji Przywódczych',
      description: 'Pogłębienie umiejętności zarządzania zespołami i inspirowania innych.',
      priority: 'Wysoki',
      area: 'Leadership',
      timeframe: '6-12 miesięcy',
      actions: [
        'Udział w programie rozwoju przywódczego',
        'Mentoring z doświadczonym liderem',
        'Praktyczne prowadzenie projektów zespołowych'
      ]
    },
    {
      title: 'Specjalizacja w Analizie Strategicznej',
      description: 'Rozwinięcie ekspertyzy w zakresie planowania strategicznego i analizy biznesowej.',
      priority: 'Średni',
      area: 'Strategia',
      timeframe: '12-18 miesięcy',
      actions: [
        'Studia podyplomowe z zakresu strategii',
        'Certyfikacja w metodykach analitycznych',
        'Praktyka w projektach strategicznych'
      ]
    },
    {
      title: 'Rozwój Kompetencji Międzykulturowych',
      description: 'Przygotowanie do pracy w środowisku międzynarodowym.',
      priority: 'Średni',
      area: 'Soft Skills',
      timeframe: '6-9 miesięcy',
      actions: [
        'Intensywny kurs języka obcego',
        'Udział w projektach międzynarodowych',
        'Szkolenia z komunikacji międzykulturowej'
      ]
    }
  ];

  return (
    <>
      {defaultRecommendations.map((recommendation, index) => (
        <motion.div
          key={index}
          className="recommendation-card"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 + (index * 0.1), duration: 0.6 }}
        >
          <div className="recommendation-header">
            <div className="recommendation-icon">🎓</div>
            <h4>{recommendation.title}</h4>
            <div className="recommendation-priority">
              <span className={`priority-badge ${recommendation.priority.toLowerCase()}`}>
                {recommendation.priority}
              </span>
            </div>
          </div>
          <p className="recommendation-description">{recommendation.description}</p>
          <div className="recommendation-details">
            <div className="detail-item">
              <span className="detail-label">Obszar:</span>
              <span className="detail-value">{recommendation.area}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Czas realizacji:</span>
              <span className="detail-value">{recommendation.timeframe}</span>
            </div>
          </div>
          <div className="recommendation-actions">
            <h5>Konkretne kroki:</h5>
            <ul>
              {recommendation.actions.map((action, i) => (
                <li key={i}>{action}</li>
              ))}
            </ul>
          </div>
        </motion.div>
      ))}
    </>
  );
};

/**
 * Domyślne ścieżki kariery gdy brak danych
 */
const DefaultCareerPaths = () => {
  const defaultCareerPaths = [
    {
      title: 'Dyrektor Strategii',
      description: 'Kierowanie rozwojem strategicznym organizacji i planowaniem długoterminowym.',
      match: 92,
      requirements: ['MBA', 'Doświadczenie strategiczne', 'Przywództwo', 'Analityka'],
      growthPotential: 'Bardzo wysoki potencjał wzrostu, szczególnie w dużych korporacjach i firmach konsultingowych.'
    },
    {
      title: 'Konsultant Biznesowy',
      description: 'Doradztwo strategiczne dla różnorodnych klientów i branż.',
      match: 88,
      requirements: ['Analityka', 'Komunikacja', 'Rozwiązywanie problemów', 'Adaptacyjność'],
      growthPotential: 'Wysoki potencjał rozwoju w dynamicznie rozwijającym się sektorze doradztwa.'
    },
    {
      title: 'Menedżer Innowacji',
      description: 'Kierowanie procesami innowacyjnymi i transformacją cyfrową.',
      match: 85,
      requirements: ['Kreatywność', 'Technologia', 'Zarządzanie zmianą', 'Wizja'],
      growthPotential: 'Bardzo wysoki potencjał w erze transformacji cyfrowej i innowacji.'
    }
  ];

  return (
    <>
      {defaultCareerPaths.map((path, index) => (
        <motion.div
          key={index}
          className="career-path-card"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.4 + (index * 0.1), duration: 0.6 }}
        >
          <div className="path-header">
            <div className="path-icon">🚀</div>
            <h4>{path.title}</h4>
            <div className="path-match">
              <span className="match-label">Dopasowanie:</span>
              <div className="match-bar">
                <motion.div 
                  className="match-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${path.match}%` }}
                  transition={{ delay: 2 + (index * 0.1), duration: 1 }}
                />
              </div>
              <span className="match-value">{path.match}%</span>
            </div>
          </div>
          <p className="path-description">{path.description}</p>
          <div className="path-requirements">
            <h5>Kluczowe wymagania:</h5>
            <div className="requirements-list">
              {path.requirements.map((req, i) => (
                <span key={i} className="requirement-tag">{req}</span>
              ))}
            </div>
          </div>
          <div className="path-growth">
            <h5>Potencjał wzrostu:</h5>
            <p>{path.growthPotential}</p>
          </div>
        </motion.div>
      ))}
    </>
  );
};

/**
 * Skeleton loader dla Academic Compass
 */
const AcademicCompassSkeleton = () => (
  <div className="academic-compass skeleton">
    <div className="section-header">
      <div className="skeleton-title" />
      <div className="skeleton-subtitle" />
    </div>
    
    <div className="recommendations-section">
      <div className="skeleton-line" />
      <div className="recommendations-grid">
        {[1, 2, 3].map(i => (
          <div key={i} className="recommendation-card skeleton-card">
            <div className="recommendation-header">
              <div className="skeleton-icon" />
              <div className="skeleton-line" />
              <div className="skeleton-badge" />
            </div>
            <div className="skeleton-line" />
            <div className="skeleton-line" />
            <div className="skeleton-line short" />
          </div>
        ))}
      </div>
    </div>
    
    <div className="career-paths-section">
      <div className="skeleton-line" />
      <div className="career-paths-grid">
        {[1, 2, 3].map(i => (
          <div key={i} className="career-path-card skeleton-card">
            <div className="path-header">
              <div className="skeleton-icon" />
              <div className="skeleton-line" />
              <div className="skeleton-bar" />
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
 * Error state dla Academic Compass
 */
const AcademicCompassError = ({ error, onRetry }) => (
  <div className="academic-compass error">
    <div className="error-content">
      <div className="error-icon">⚠️</div>
      <h3>Błąd ładowania Kompasu Akademickiego</h3>
      <p>{error}</p>
      <button className="retry-button" onClick={onRetry}>
        Spróbuj ponownie
      </button>
    </div>
  </div>
);
