import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { CoreEssence } from './CoreEssence';
import { KPIPanel } from './KPIPanel';
import { DeepAnalysisPanel } from './DeepAnalysisPanel';
import { TransformationPanel } from './TransformationPanel';
import { ActionCenter } from './ActionCenter';
import { bbtDataTransformer } from '../../services/soul-mirror/bbtDataTransformer';
import { ArcanumLoader } from '../arcanum/ArcanumLoader';

/**
 * Soul Mirror Dashboard - Futurystyczny dashboard BBT/OTK
 * Inspirowany chińskim stylem "centrum misji"
 */
export const SoulMirrorDashboard = ({ clientData }) => {
  const { t } = useTranslation();
  const [transformedData, setTransformedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedFactor, setSelectedFactor] = useState(null);
  const [activeModule, setActiveModule] = useState('overview');

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        setLoading(true);
        
        // Transformacja danych BBT do formatów wizualizacji
        const transformed = await bbtDataTransformer.transformBBTData(clientData);
        setTransformedData(transformed);
        
        // Symulacja ładowania dla efektu wizualnego
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setLoading(false);
      } catch (error) {
        console.error('Błąd inicjalizacji Soul Mirror Dashboard:', error);
        setLoading(false);
      }
    };

    if (clientData) {
      initializeDashboard();
    }
  }, [clientData]);

  const handleFactorSelect = (factor) => {
    setSelectedFactor(factor);
  };

  const handleModuleChange = (module) => {
    setActiveModule(module);
  };

  if (loading || !transformedData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <ArcanumLoader 
          message="Inicjalizacja Lustra Duszy..."
          showProgress={true}
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="soul-mirror-dashboard min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden"
    >
      {/* Tło z efektami */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-900/40 to-slate-900"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Główny kontener dashboardu */}
      <div className="relative z-10 h-screen grid grid-rows-[auto_1fr_auto] grid-cols-[300px_1fr_300px] gap-4 p-4">
        
        {/* Górny Panel KPI - rozciągnięty na całą szerokość */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="col-span-3 h-24"
        >
          <KPIPanel 
            data={transformedData}
            onModuleChange={handleModuleChange}
            activeModule={activeModule}
          />
        </motion.div>

        {/* Lewy Panel - Analiza Głęboka */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="row-span-1"
        >
          <DeepAnalysisPanel 
            data={transformedData}
            selectedFactor={selectedFactor}
            onFactorSelect={handleFactorSelect}
            activeModule={activeModule}
          />
        </motion.div>

        {/* Centralny Rdzeń Esencji */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="row-span-1 flex items-center justify-center"
        >
          <CoreEssence 
            data={transformedData}
            selectedFactor={selectedFactor}
            onFactorSelect={handleFactorSelect}
          />
        </motion.div>

        {/* Prawy Panel - Centrum Transformacji */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="row-span-1"
        >
          <TransformationPanel 
            data={transformedData}
            selectedFactor={selectedFactor}
            activeModule={activeModule}
          />
        </motion.div>

        {/* Dolny Panel - Centrum Akcji */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="col-span-3 h-20"
        >
          <ActionCenter 
            data={transformedData}
            clientData={clientData}
          />
        </motion.div>
      </div>

      {/* Efekty wizualne */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {/* Pulsujące światła w rogach */}
        <div className="absolute top-4 left-4 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
        <div className="absolute top-4 right-4 w-2 h-2 bg-amber-400 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-4 left-4 w-2 h-2 bg-violet-400 rounded-full animate-pulse delay-2000"></div>
        <div className="absolute bottom-4 right-4 w-2 h-2 bg-emerald-400 rounded-full animate-pulse delay-3000"></div>
      </div>
    </motion.div>
  );
};

SoulMirrorDashboard.propTypes = {
  clientData: PropTypes.object.isRequired,
};

export default SoulMirrorDashboard;
