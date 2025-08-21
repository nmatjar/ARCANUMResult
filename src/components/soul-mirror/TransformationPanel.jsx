import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

/**
 * Transformation Panel - Prawy panel z centrum transformacji
 */
export const TransformationPanel = ({ data, selectedFactor, activeModule }) => {
  const { superpowers, recommendations } = data;

  const renderContent = () => {
    switch (activeModule) {
      case 'development':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-cyan-300 mb-4">🚀 Rozwój</h3>
            
            {/* Ścieżki Rozwoju */}
            <div className="bg-slate-700/30 rounded-lg p-4">
              <h4 className="text-sm font-medium text-slate-300 mb-3">Rekomendacje</h4>
              <div className="space-y-3">
                {recommendations.map((rec, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-3 rounded-lg ${
                      rec.type === 'strength' 
                        ? 'bg-green-500/10 border border-green-500/20' 
                        : 'bg-orange-500/10 border border-orange-500/20'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-lg">
                        {rec.type === 'strength' ? '💪' : '⚠️'}
                      </span>
                      <h5 className="text-sm font-medium text-slate-200">{rec.title}</h5>
                    </div>
                    <p className="text-xs text-slate-400 mb-2">{rec.description}</p>
                    <div className="space-y-1">
                      {rec.actions.map((action, actionIndex) => (
                        <div key={actionIndex} className="flex items-center space-x-2">
                          <div className="w-1 h-1 bg-cyan-400 rounded-full" />
                          <span className="text-xs text-slate-300">{action}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Zasoby Rozwoju */}
            <div className="bg-slate-700/30 rounded-lg p-4">
              <h4 className="text-sm font-medium text-slate-300 mb-3">Zasoby</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-xs">
                  <span>📚</span>
                  <span className="text-slate-400">Książki do rozwoju</span>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <span>🎓</span>
                  <span className="text-slate-400">Kursy online</span>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <span>🎧</span>
                  <span className="text-slate-400">Podcasty</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'insights':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-cyan-300 mb-4">💡 Transformacja</h3>
            
            {/* Potencjał Transformacji */}
            <div className="bg-slate-700/30 rounded-lg p-4">
              <h4 className="text-sm font-medium text-slate-300 mb-3">Obszary Wzrostu</h4>
              <div className="space-y-3">
                {superpowers.slice(0, 2).map((power, index) => (
                  <div key={power.id} className="p-3 bg-slate-600/30 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: power.color }}
                      />
                      <span className="text-sm font-medium text-slate-200">{power.name}</span>
                    </div>
                    <p className="text-xs text-slate-400">{power.description}</p>
                    <div className="mt-2 flex items-center space-x-2">
                      <span className="text-xs text-slate-500">Siła:</span>
                      <div className="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full"
                          style={{ 
                            backgroundColor: power.color,
                            width: `${(power.strength / 10) * 100}%`
                          }}
                        />
                      </div>
                      <span className="text-xs text-slate-300">{power.strength}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strategia Transformacji */}
            <div className="bg-slate-700/30 rounded-lg p-4">
              <h4 className="text-sm font-medium text-slate-300 mb-3">Strategia</h4>
              <div className="space-y-2 text-xs text-slate-400">
                <div>1. Wzmacniaj naturalne talenty</div>
                <div>2. Zarządzaj wyzwaniami</div>
                <div>3. Rozwijaj nowe kompetencje</div>
                <div>4. Integruj przeciwieństwa</div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-cyan-300 mb-4">✨ Supermoce</h3>
            
            {/* Lista Supermocy */}
            <div className="space-y-3">
              {superpowers.map((power, index) => (
                <motion.div
                  key={power.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-slate-700/30 rounded-lg p-4 hover:bg-slate-700/50 transition-all"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div 
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: power.color }}
                    />
                    <h4 className="text-sm font-semibold text-slate-200">{power.name}</h4>
                  </div>
                  
                  <p className="text-xs text-slate-400 mb-3">{power.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-slate-500">Komponenty:</span>
                      <div className="flex space-x-1">
                        {power.components.map((comp, compIndex) => (
                          <span 
                            key={compIndex}
                            className="text-xs bg-slate-600 text-slate-300 px-2 py-1 rounded"
                          >
                            {comp}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-cyan-300">{power.strength}</div>
                      <div className="text-xs text-slate-500">siła</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Potencjał Synergii */}
            <div className="bg-slate-700/30 rounded-lg p-4">
              <h4 className="text-sm font-medium text-slate-300 mb-3">Potencjał Synergii</h4>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400 mb-1">
                  {superpowers.reduce((sum, power) => sum + power.strength, 0)}
                </div>
                <div className="text-xs text-slate-400">Łączna siła</div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 h-full overflow-y-auto"
    >
      {renderContent()}
    </motion.div>
  );
};

TransformationPanel.propTypes = {
  data: PropTypes.object.isRequired,
  selectedFactor: PropTypes.string,
  activeModule: PropTypes.string.isRequired,
};
