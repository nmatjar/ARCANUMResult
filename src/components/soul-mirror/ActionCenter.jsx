import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

/**
 * Action Center - Dolny panel z centrum akcji
 */
export const ActionCenter = ({ data, clientData }) => {
  const { kpiData } = data;

  const actionItems = [
    {
      icon: '💬',
      label: 'Profil Komunikacyjny',
      value: 'Ekspresywny',
      color: 'text-blue-400'
    },
    {
      icon: '🎭',
      label: 'Archetyp Zawodowy',
      value: 'Wizjoner-Analityk',
      color: 'text-purple-400'
    },
    {
      icon: '🎯',
      label: 'Główny Talent',
      value: kpiData.topStrengths[0]?.name || 'Analiza',
      color: 'text-green-400'
    },
    {
      icon: '⚡',
      label: 'Energia',
      value: `${kpiData.energyLevel >= 0 ? '+' : ''}${kpiData.energyLevel}`,
      color: kpiData.energyLevel >= 0 ? 'text-orange-400' : 'text-red-400'
    }
  ];

  const quickActions = [
    { icon: '📊', label: 'Raport PDF', action: 'generateReport' },
    { icon: '🔄', label: 'Odśwież', action: 'refresh' },
    { icon: '📤', label: 'Udostępnij', action: 'share' },
    { icon: '⚙️', label: 'Ustawienia', action: 'settings' }
  ];

  const handleQuickAction = (action) => {
    console.log(`Akcja: ${action}`);
    // Tu będzie implementacja konkretnych akcji
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 h-full"
    >
      <div className="flex items-center justify-between h-full">
        
        {/* Informacje kontekstowe */}
        <div className="flex items-center space-x-8">
          {actionItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-2"
            >
              <span className="text-lg">{item.icon}</span>
              <div>
                <div className="text-xs text-slate-400">{item.label}</div>
                <div className={`text-sm font-medium ${item.color}`}>{item.value}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mantra osobista */}
        <div className="flex-1 text-center mx-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-sm italic text-slate-300"
          >
            "Tworzę przyszłość przez analizę i wizję"
          </motion.div>
        </div>

        {/* Szybkie akcje */}
        <div className="flex items-center space-x-2">
          {quickActions.map((action, index) => (
            <motion.button
              key={action.action}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleQuickAction(action.action)}
              className="flex flex-col items-center p-2 bg-slate-700/30 hover:bg-slate-600/50 rounded-lg transition-all border border-slate-600/30 hover:border-slate-500/50"
              title={action.label}
            >
              <span className="text-lg mb-1">{action.icon}</span>
              <span className="text-xs text-slate-400">{action.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Status klienta */}
        <div className="ml-4 text-right">
          <div className="text-xs text-slate-400">Klient</div>
          <div className="text-sm text-slate-300">{clientData?.code || 'DEMO'}</div>
          <div className="flex items-center space-x-1 mt-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs text-green-300">Aktywny</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

ActionCenter.propTypes = {
  data: PropTypes.object.isRequired,
  clientData: PropTypes.object,
};
