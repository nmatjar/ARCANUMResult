import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ArcanumLoader } from './ArcanumLoader';

export const ResultModal = ({ isOpen, onClose, isLoading, result, title }) => {
  const { t } = useTranslation();
  if (!isOpen) {
    return null;
  }

  const renderResult = () => {
    if (!result) return null;

    if (result.type === 'html') {
      return <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: result.data }} />;
    }

    if (result.type === 'json') {
      // Placeholder for chart component
      return (
        <div>
          <h3 className="text-lg font-semibold mb-2 text-indigo-300">Dane JSON do wizualizacji:</h3>
          <pre className="bg-gray-900 p-4 rounded-lg text-sm text-yellow-300 overflow-x-auto">
            {JSON.stringify(result.data, null, 2)}
          </pre>
        </div>
      );
    }
    return null;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-indigo-400">{title}</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
            </header>
            <main className="p-6 overflow-y-auto">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <ArcanumLoader message={t('promptCatalog.generatingAnalysis')} />
                </div>
              ) : (
                renderResult()
              )}
            </main>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

ResultModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  result: PropTypes.object,
  title: PropTypes.string,
};
