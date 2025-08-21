import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

/**
 * KPI Panel - Górny panel z kluczowymi wskaźnikami "Centrum Kontroli Misji"
 */
export const KPIPanel = ({ data, onModuleChange, activeModule }) => {
  const { kpiData } = data;

  const modules = [
    { id: 'overview', name: 'Przegląd', icon: '🎯' },
    { id: 'analysis', name: 'Analiza', icon: '🔍' },
    { id: 'development', name: 'Rozwój', icon: '🚀' },
    { id: 'insights', name: 'Wglądy', icon: '💡' }
  ];

  const kpiItems = [
    {
      label: 'Energia Życiowa',
      value: kpiData.energyLevel,
      max: 10,
      color: 'from-orange-500 to-red-500',
      icon: '⚡'
    },
    {
      label: 'Potencjał Twórczy',
      value: kpiData.creativePotential,
      max: 10,
      color: 'from-yellow-500 to-amber-500',
      icon: '✨'
    },
    {
      label: 'Harmonia Społeczna',
      value: kpiData.socialHarmony,
      max: 10,
      color: 'from-green-500 to-emerald-500',
      icon: '🤝'
    },
    {
      label: 'Indeks Stabilności',
      value: kpiData.stabilityIndex,
      max: 10,
      color: 'from-blue-500 to-cyan-500',
      icon: '🏛️'
    }
  ];

  const getValueColor = (value) => {
    if (value >= 7) return 'text-green-400';
    if (value >= 4) return 'text-yellow-400';
    if (value >= 0) return 'text-orange-400';
    return 'text-red-400';
  };

  const getProgressWidth = (value, max) => {
    const normalizedValue = Math.max(-max, Math.min(max, value));
    return Math.abs(normalizedValue) / max * 100;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 h-full"
    >
      <div className="flex items-center justify-between h-full">
        
        {/* Nawigacja modułów */}
        <div className="flex space-x-2">
          {modules.map((module) => (
            <motion.button
              key={module.id}
              onClick={() => onModuleChange(module.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${activeModule === module.id 
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' 
                  : 'bg-slate-700/30 text-slate-300 hover:bg-slate-600/30 border border-transparent'
                }
              `}
            >
              <span className="mr-2">{module.icon}</span>
              {module.name}
            </motion.button>
          ))}
        </div>

        {/* Wskaźniki KPI */}
        <div className="flex space-x-6">
          {kpiItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center min-w-[120px]"
            >
              {/* Ikona i wartość */}
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-lg">{item.icon}</span>
                <span className={`text-xl font-bold ${getValueColor(item.value)}`}>
                  {item.value >= 0 ? '+' : ''}{item.value}
                </span>
              </div>

              {/* Pasek postępu */}
              <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden mb-1">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${getProgressWidth(item.value, item.max)}%` }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                  className={`h-full bg-gradient-to-r ${item.color} rounded-full`}
                />
              </div>

              {/* Etykieta */}
              <span className="text-xs text-slate-400 text-center leading-tight">
                {item.label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Status systemu */}
        <div className="flex items-center space-x-4">
          {/* Współczynnik napięcia */}
          <div className="text-center">
            <div className="flex items-center space-x-1 mb-1">
              <span className="text-sm text-slate-400">Napięcie</span>
              <div className={`w-2 h-2 rounded-full animate-pulse ${
                data.tensions.level === 'Niski' ? 'bg-green-400' :
                data.tensions.level === 'Umiarkowany' ? 'bg-yellow-400' :
                data.tensions.level === 'Wysoki' ? 'bg-orange-400' : 'bg-red-400'
              }`} />
            </div>
            <span className="text-xs text-slate-300">{data.tensions.level}</span>
          </div>

          {/* Status połączenia */}
          <div className="text-center">
            <div className="flex items-center space-x-1 mb-1">
              <span className="text-sm text-slate-400">System</span>
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            </div>
            <span className="text-xs text-green-300">Online</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

KPIPanel.propTypes = {
  data: PropTypes.object.isRequired,
  onModuleChange: PropTypes.func.isRequired,
  activeModule: PropTypes.string.isRequired,
};
