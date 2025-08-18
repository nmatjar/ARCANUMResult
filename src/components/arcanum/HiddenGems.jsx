import { motion } from 'framer-motion';

/**
 * Hidden Gems - Poziom 4 ARCĀNUM
 * Odkrywanie ukrytych talentów i potencjałów
 */
export const HiddenGems = ({ data, loading, onLoad, onLoadNext, onRetry }) => {
  // Auto-load jeśli nie ma danych
  if (!data && !loading && onLoad) {
    onLoad();
  }

  if (loading) {
    return <HiddenGemsSkeleton />;
  }

  if (!data || !data.success) {
    return (
      <HiddenGemsError 
        error={data?.error || 'Błąd ładowania danych'} 
        onRetry={onRetry} 
      />
    );
  }

  const { content } = data;
  const {
    hiddenTalents = [],
    untappedPotentials = [],
    uniqueStrengths = [],
    sections = {}
  } = content || {};

  return (
    <motion.section 
      className="hidden-gems"
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
        <h2 className="section-title">Ukryte Skarby</h2>
        <p className="section-subtitle">
          Odkrywanie niewidocznych talentów i niewykorzystanych potencjałów
        </p>
      </motion.div>

      {/* Hidden Talents */}
      <div className="talents-section">
        <motion.h3
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          💎 Ukryte Talenty
        </motion.h3>
        <div className="gems-grid">
          {hiddenTalents.length > 0 ? (
            hiddenTalents.map((talent, index) => (
              <motion.div
                key={index}
                className="gem-card talent-card"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6 + (index * 0.1), duration: 0.6 }}
              >
                <div className="gem-icon">💎</div>
                <h4>{talent.name}</h4>
                <p className="gem-description">{talent.description}</p>
                <div className="gem-potential">
                  <span className="potential-label">Potencjał rozwoju:</span>
                  <div className="potential-bar">
                    <motion.div 
                      className="potential-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${talent.potential}%` }}
                      transition={{ delay: 1 + (index * 0.1), duration: 1 }}
                    />
                  </div>
                  <span className="potential-value">{talent.potential}%</span>
                </div>
                <div className="gem-actions">
                  <h5>Jak rozwijać:</h5>
                  <ul>
                    {talent.developmentActions?.map((action, i) => (
                      <li key={i}>{action}</li>
                    )) || []}
                  </ul>
                </div>
              </motion.div>
            ))
          ) : (
            <DefaultTalents />
          )}
        </div>
      </div>

      {/* Untapped Potentials */}
      <div className="potentials-section">
        <motion.h3
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          🌟 Niewykorzystane Potencjały
        </motion.h3>
        <div className="gems-grid">
          {untappedPotentials.length > 0 ? (
            untappedPotentials.map((potential, index) => (
              <motion.div
                key={index}
                className="gem-card potential-card"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.4 + (index * 0.1), duration: 0.6 }}
              >
                <div className="gem-icon">🌟</div>
                <h4>{potential.name}</h4>
                <p className="gem-description">{potential.description}</p>
                <div className="gem-impact">
                  <span className="impact-label">Potencjalny wpływ:</span>
                  <span className="impact-value">{potential.impact || 'Wysoki'}</span>
                </div>
                <div className="gem-unlock">
                  <h5>Jak odblokować:</h5>
                  <ul>
                    {potential.unlockMethods?.map((method, i) => (
                      <li key={i}>{method}</li>
                    )) || []}
                  </ul>
                </div>
              </motion.div>
            ))
          ) : (
            <DefaultPotentials />
          )}
        </div>
      </div>

      {/* Unique Strengths */}
      <div className="strengths-section">
        <motion.h3
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 2, duration: 0.6 }}
        >
          ⚡ Unikalne Mocne Strony
        </motion.h3>
        <div className="strengths-grid">
          {uniqueStrengths.length > 0 ? (
            uniqueStrengths.map((strength, index) => (
              <motion.div
                key={index}
                className="strength-card"
                initial={{ rotateY: 90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                transition={{ delay: 2.2 + (index * 0.1), duration: 0.6 }}
              >
                <div className="strength-icon">⚡</div>
                <h4>{strength.name}</h4>
                <p className="strength-description">{strength.description}</p>
                <div className="strength-applications">
                  <h5>Zastosowania:</h5>
                  <div className="applications-list">
                    {strength.applications?.map((app, i) => (
                      <span key={i} className="application-tag">{app}</span>
                    )) || []}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <DefaultStrengths />
          )}
        </div>
      </div>

      {/* Integration Insights */}
      {sections['Integration Insights'] && (
        <motion.div 
          className="integration-insights"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 2.8, duration: 0.6 }}
        >
          <h3>Insights Integracyjne</h3>
          <div className="insights-content">
            {sections['Integration Insights']}
          </div>
        </motion.div>
      )}

      {/* Call to Action */}
      <motion.div 
        className="level-cta"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 3, duration: 0.6 }}
      >
        <p className="cta-text">
          Gotowy na ostateczną analizę - Kompas Akademicki?
        </p>
        <button 
          className="cta-button"
          onClick={onLoadNext}
        >
          <span>Przejdź do Kompasu Akademickiego</span>
          <div className="button-glow" />
        </button>
      </motion.div>
    </motion.section>
  );
};

/**
 * Domyślne talenty gdy brak danych
 */
const DefaultTalents = () => {
  const defaultTalents = [
    {
      name: 'Strategiczne Myślenie',
      description: 'Naturalna zdolność do widzenia szerokiego obrazu i planowania długoterminowego.',
      potential: 92,
      developmentActions: [
        'Uczestnictwo w projektach strategicznych',
        'Mentoring od doświadczonych strategów',
        'Studia przypadków z różnych branż'
      ]
    },
    {
      name: 'Innowacyjność',
      description: 'Wyjątkowa zdolność do generowania kreatywnych rozwiązań problemów.',
      potential: 88,
      developmentActions: [
        'Udział w sesjach design thinking',
        'Eksperymentowanie z nowymi technologiami',
        'Współpraca z zespołami R&D'
      ]
    },
    {
      name: 'Przywództwo Transformacyjne',
      description: 'Talent do inspirowania i prowadzenia zmian organizacyjnych.',
      potential: 85,
      developmentActions: [
        'Prowadzenie projektów zmiany',
        'Coaching przywódczy',
        'Studia przypadków transformacji'
      ]
    }
  ];

  return (
    <>
      {defaultTalents.map((talent, index) => (
        <motion.div
          key={index}
          className="gem-card talent-card"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6 + (index * 0.1), duration: 0.6 }}
        >
          <div className="gem-icon">💎</div>
          <h4>{talent.name}</h4>
          <p className="gem-description">{talent.description}</p>
          <div className="gem-potential">
            <span className="potential-label">Potencjał rozwoju:</span>
            <div className="potential-bar">
              <motion.div 
                className="potential-fill"
                initial={{ width: 0 }}
                animate={{ width: `${talent.potential}%` }}
                transition={{ delay: 1 + (index * 0.1), duration: 1 }}
              />
            </div>
            <span className="potential-value">{talent.potential}%</span>
          </div>
          <div className="gem-actions">
            <h5>Jak rozwijać:</h5>
            <ul>
              {talent.developmentActions.map((action, i) => (
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
 * Domyślne potencjały gdy brak danych
 */
const DefaultPotentials = () => {
  const defaultPotentials = [
    {
      name: 'Mentoring i Coaching',
      description: 'Niewykorzystana zdolność do rozwoju innych i przekazywania wiedzy.',
      impact: 'Bardzo wysoki',
      unlockMethods: [
        'Rozpoczęcie programu mentorskiego',
        'Szkolenie z technik coachingowych',
        'Praktyka w prowadzeniu zespołów'
      ]
    },
    {
      name: 'Międzykulturowe Przywództwo',
      description: 'Potencjał do skutecznego zarządzania w środowisku międzynarodowym.',
      impact: 'Wysoki',
      unlockMethods: [
        'Projekty międzynarodowe',
        'Nauka języków obcych',
        'Studia kulturowe'
      ]
    }
  ];

  return (
    <>
      {defaultPotentials.map((potential, index) => (
        <motion.div
          key={index}
          className="gem-card potential-card"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.4 + (index * 0.1), duration: 0.6 }}
        >
          <div className="gem-icon">🌟</div>
          <h4>{potential.name}</h4>
          <p className="gem-description">{potential.description}</p>
          <div className="gem-impact">
            <span className="impact-label">Potencjalny wpływ:</span>
            <span className="impact-value">{potential.impact}</span>
          </div>
          <div className="gem-unlock">
            <h5>Jak odblokować:</h5>
            <ul>
              {potential.unlockMethods.map((method, i) => (
                <li key={i}>{method}</li>
              ))}
            </ul>
          </div>
        </motion.div>
      ))}
    </>
  );
};

/**
 * Domyślne mocne strony gdy brak danych
 */
const DefaultStrengths = () => {
  const defaultStrengths = [
    {
      name: 'Synteza Kompleksowa',
      description: 'Wyjątkowa zdolność do łączenia różnorodnych informacji w spójną całość.',
      applications: ['Analiza strategiczna', 'Rozwiązywanie problemów', 'Planowanie']
    },
    {
      name: 'Intuicja Biznesowa',
      description: 'Naturalne wyczucie trendów rynkowych i możliwości biznesowych.',
      applications: ['Rozwój produktu', 'Strategia rynkowa', 'Inwestycje']
    }
  ];

  return (
    <>
      {defaultStrengths.map((strength, index) => (
        <motion.div
          key={index}
          className="strength-card"
          initial={{ rotateY: 90, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          transition={{ delay: 2.2 + (index * 0.1), duration: 0.6 }}
        >
          <div className="strength-icon">⚡</div>
          <h4>{strength.name}</h4>
          <p className="strength-description">{strength.description}</p>
          <div className="strength-applications">
            <h5>Zastosowania:</h5>
            <div className="applications-list">
              {strength.applications.map((app, i) => (
                <span key={i} className="application-tag">{app}</span>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </>
  );
};

/**
 * Skeleton loader dla Hidden Gems
 */
const HiddenGemsSkeleton = () => (
  <div className="hidden-gems skeleton">
    <div className="section-header">
      <div className="skeleton-title" />
      <div className="skeleton-subtitle" />
    </div>
    
    {[1, 2, 3].map(section => (
      <div key={section} className="gems-section">
        <div className="skeleton-line" />
        <div className="gems-grid">
          {[1, 2, 3].map(i => (
            <div key={i} className="gem-card skeleton-card">
              <div className="skeleton-icon" />
              <div className="skeleton-line" />
              <div className="skeleton-line" />
              <div className="skeleton-line short" />
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

/**
 * Error state dla Hidden Gems
 */
const HiddenGemsError = ({ error, onRetry }) => (
  <div className="hidden-gems error">
    <div className="error-content">
      <div className="error-icon">⚠️</div>
      <h3>Błąd ładowania Ukrytych Skarbów</h3>
      <p>{error}</p>
      <button className="retry-button" onClick={onRetry}>
        Spróbuj ponownie
      </button>
    </div>
  </div>
);
