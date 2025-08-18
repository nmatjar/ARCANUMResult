import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

/**
 * Komponent do wprowadzania kodu dostępu klienta
 * Wyświetla się gdy brak kodu w URL
 */
export const CodeInput = ({ onCodeSubmit, loading = false }) => {
  const { t } = useTranslation();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!code.trim()) {
      setError(t('enterCode'));
      return;
    }

    if (code.length < 3) {
      setError(t('codeTooShort'));
      return;
    }

    setError('');
    onCodeSubmit(code.trim().toUpperCase());
  };

  const handleInputChange = (e) => {
    const value = e.target.value.toUpperCase();
    setCode(value);
    if (error) setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md border border-slate-700/50 shadow-2xl"
      >
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center"
          >
            <span className="text-2xl font-bold text-slate-900">A</span>
          </motion.div>
          
          <h1 className="text-2xl font-bold text-white mb-2">
            {t('resultsPortal')}
          </h1>
          
          <p className="text-slate-400 text-sm">
            {t('enterCodePrompt')}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-slate-300 mb-2">
              {t('accessCode')}
            </label>
            
            <input
              id="code"
              type="text"
              value={code}
              onChange={handleInputChange}
              placeholder={t('codePlaceholder')}
              disabled={loading}
              className={`w-full px-4 py-3 bg-slate-700/50 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                error 
                  ? 'border-red-500 focus:ring-red-500/50' 
                  : 'border-slate-600 focus:ring-amber-500/50 focus:border-amber-500'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              autoComplete="off"
              spellCheck="false"
            />
            
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm mt-2 flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </motion.p>
            )}
          </div>

          <motion.button
            type="submit"
            disabled={loading || !code.trim()}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center ${
              loading || !code.trim()
                ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-lg hover:shadow-amber-500/25'
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('checkingAccess')}...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2m-2-2a2 2 0 00-2 2m2-2V5a2 2 0 00-2-2H9a2 2 0 00-2 2v2M7 7a2 2 0 012-2m0 0a2 2 0 012 2m-2-2a2 2 0 00-2 2m2-2V5a2 2 0 002-2m0 0V3a2 2 0 012-2 2 2 0 012 2v2M7 7a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2V9a2 2 0 00-2-2H7z" />
                </svg>
                {t('accessResults')}
              </>
            )}
          </motion.button>
        </form>

        {/* Help Text */}
        <div className="mt-6 pt-6 border-t border-slate-700/50">
          <p className="text-xs text-slate-500 text-center">
            {t('codeInfo')}
            <br />
            {t('problemAccessing')} <a href="mailto:support@arcanum.pl" className="text-amber-400 hover:text-amber-300 transition-colors">{t('contactUs')}</a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

CodeInput.propTypes = {
  onCodeSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};
