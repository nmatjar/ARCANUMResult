import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { SpiderChart } from './visualizations/SpiderChart';

/**
 * Deep Analysis Panel - Lewy panel z głęboką analizą
 */
export const DeepAnalysisPanel = ({ data, selectedFactor, onFactorSelect, activeModule }) => {
  const { conflictData, tensions, factorDetails } = data;

  const renderContent = () => {
    switch (activeModule) {
      case 'analysis':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-cyan-300 mb-4">🔍 Analiza Głęboka</h3>
            
            {/* Wykres Pająka BBT */}
            <div className="bg-slate-700/30 rounded-lg p-4">
              <h4 className="text-sm font-medium text-slate-300 mb-3">Profil BBT</h4>
              <SpiderChart data={data.radarData} />
            </div>

            {/* Konflikty */}
            {conflictData.length > 0 && (
              <div className="bg-slate-700/30 rounded-lg p-4">
                <h4 className="text-sm font-medium text-slate-300 mb-3">Konflikty Rewersyjne</h4>
                <div className="space-y-2">
                  {conflictData.map((conflict, index) => (
                    <div key={index} className="flex items-center space-x-2 text-xs">
                      <div className="w-2 h-2 bg-red-400 rounded-full" />
                      <span className="text-slate-400">{conflict.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'insights':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-cyan-300 mb-4">💡 Wglądy</h3>
            
            {/* Hierarchia Potrzeb */}
            <div className="bg-slate-700/30 rounded-lg p-4">
              <h4 className="text-sm font-medium text-slate-300 mb-3">Hierarchia Potrzeb</h4>
              <div className="space-y-2">
                {Object.entries(factorDetails)
                  .sort(([,a], [,b]) => b.primary.wektor - a.primary.wektor)
                  .slice(0, 5)
                  .map(([factor, details]) => (
                    <div key={factor} className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">{details.name}</span>
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-12 h-1 rounded-full"
                          style={{ backgroundColor: details.color }}
                        />
                        <span className="text-xs text-slate-300">
                          {details.primary.wektor >= 0 ? '+' : ''}{details.primary.wektor}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Napięcia */}
            <div className="bg-slate-700/30 rounded-lg p-4">
              <h4 className="text-sm font-medium text-slate-300 mb-3">Mapa Napięć</h4>
              <div className="text-center">
                <div className={`text-2xl font-bold mb-2 ${
                  tensions.level === 'Niski' ? 'text-green-400' :
                  tensions.level === 'Umiarkowany' ? 'text-yellow-400' :
                  tensions.level === 'Wysoki' ? 'text-orange-400' : 'text-red-400'
                }`}>
                  {tensions.total}
                </div>
                <div className="text-xs text-slate-400">Poziom: {tensions.level}</div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-cyan-300 mb-4">🎯 Przegląd</h3>
            
            {/* Najsilniejsze czynniki */}
            <div className="bg-slate-700/30 rounded-lg p-4">
              <h4 className="text-sm font-medium text-slate-300 mb-3">Dominujące Czynniki</h4>
              <div className="space-y-3">
                {Object.entries(factorDetails)
                  .sort(([,a], [,b]) => b.primary.wektor - a.primary.wektor)
                  .slice(0, 3)
                  .map(([factor, details]) => (
                    <motion.div
                      key={factor}
                      whileHover={{ scale: 1.02 }}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${
                        selectedFactor === factor 
                          ? 'bg-cyan-500/20 border border-cyan-500/30' 
                          : 'bg-slate-600/30 hover:bg-slate-600/50'
                      }`}
                      onClick={() => onFactorSelect(factor)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-200">{factor}</span>
                        <span className={`text-sm font-bold ${
                          details.primary.wektor >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {details.primary.wektor >= 0 ? '+' : ''}{details.primary.wektor}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mb-1">{details.name}</div>
                      <div className="text-xs text-slate-500">{details.interpretation}</div>
                    </motion.div>
                  ))}
              </div>
            </div>

            {/* Wyzwania */}
            <div className="bg-slate-700/30 rounded-lg p-4">
              <h4 className="text-sm font-medium text-slate-300 mb-3">Główne Wyzwania</h4>
              <div className="space-y-2">
                {Object.entries(factorDetails)
                  .filter(([,details]) => details.primary.wektor < -2)
                  .slice(0, 3)
                  .map(([factor, details]) => (
                    <div key={factor} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-orange-400 rounded-full" />
                      <span className="text-xs text-slate-400">{details.name}</span>
                      <span className="text-xs text-red-400">
                        {details.primary.wektor}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 h-full overflow-y-auto"
    >
      {renderContent()}
    </motion.div>
  );
};

DeepAnalysisPanel.propTypes = {
  data: PropTypes.object.isRequired,
  selectedFactor: PropTypes.string,
  onFactorSelect: PropTypes.func.isRequired,
  activeModule: PropTypes.string.isRequired,
};
