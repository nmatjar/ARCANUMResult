import { useState } from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { BBT_FACTORS, FACTOR_COLORS } from '../../services/soul-mirror/bbtDataTransformer';

/**
 * Core Essence - Centralny "Kryształ Potencjału" z interaktywną wizualizacją
 */
export const CoreEssence = ({ data, selectedFactor, onFactorSelect }) => {
  const [hoveredFactor, setHoveredFactor] = useState(null);
  const [isRotating, setIsRotating] = useState(true);

  const { factorDetails, rawData } = data;

  // Obliczanie pozycji czynników w okręgu
  const factors = Object.keys(BBT_FACTORS);
  const angleStep = (2 * Math.PI) / factors.length;

  const getFactorPosition = (index, radius = 120) => {
    const angle = index * angleStep - Math.PI / 2; // Start from top
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius
    };
  };

  const getFactorSize = (factor) => {
    const value = Math.abs(rawData.prymalne[factor]?.wektor || 0);
    return Math.max(20, Math.min(60, value * 4 + 20));
  };

  const getFactorOpacity = (factor) => {
    const value = Math.abs(rawData.prymalne[factor]?.wektor || 0);
    return Math.max(0.3, Math.min(1, value / 10));
  };

  const getFactorColor = (factor) => {
    const value = rawData.prymalne[factor]?.wektor || 0;
    return value >= 0 ? FACTOR_COLORS[factor].positive : FACTOR_COLORS[factor].negative;
  };

  const handleFactorClick = (factor) => {
    onFactorSelect(factor === selectedFactor ? null : factor);
  };

  const toggleRotation = () => {
    setIsRotating(!isRotating);
  };

  return (
    <div className="relative w-80 h-80 flex items-center justify-center">
      {/* Tło kryształu */}
      <motion.div
        animate={{ rotate: isRotating ? 360 : 0 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 rounded-full bg-gradient-radial from-purple-500/10 via-cyan-500/5 to-transparent border border-cyan-500/20"
      />

      {/* Koncentryczne okręgi */}
      {[60, 90, 120, 150].map((radius, index) => (
        <motion.div
          key={radius}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.1 - index * 0.02 }}
          transition={{ delay: index * 0.2 }}
          className="absolute border border-cyan-400/20 rounded-full"
          style={{
            width: radius * 2,
            height: radius * 2,
          }}
        />
      ))}

      {/* Centralny rdzeń */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
        className="absolute w-16 h-16 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full shadow-lg shadow-cyan-500/50 flex items-center justify-center cursor-pointer z-10"
        onClick={toggleRotation}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="text-2xl">🔮</span>
      </motion.div>

      {/* Czynniki BBT jako węzły */}
      {factors.map((factor, index) => {
        const position = getFactorPosition(index);
        const size = getFactorSize(factor);
        const opacity = getFactorOpacity(factor);
        const color = getFactorColor(factor);
        const isSelected = selectedFactor === factor;
        const isHovered = hoveredFactor === factor;

        return (
          <motion.div
            key={factor}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: opacity,
              x: position.x,
              y: position.y
            }}
            transition={{ delay: 0.8 + index * 0.1 }}
            whileHover={{ scale: 1.2, zIndex: 20 }}
            className="absolute cursor-pointer"
            onClick={() => handleFactorClick(factor)}
            onMouseEnter={() => setHoveredFactor(factor)}
            onMouseLeave={() => setHoveredFactor(null)}
          >
            {/* Węzeł czynnika */}
            <motion.div
              className={`
                rounded-full flex items-center justify-center text-white font-bold text-sm
                ${isSelected ? 'ring-4 ring-cyan-400 ring-opacity-60' : ''}
                ${isHovered ? 'shadow-lg' : ''}
              `}
              style={{
                width: size,
                height: size,
                backgroundColor: color,
                boxShadow: isSelected ? `0 0 20px ${color}` : `0 0 10px ${color}40`
              }}
              animate={{
                boxShadow: isSelected ? `0 0 30px ${color}` : `0 0 10px ${color}40`
              }}
            >
              {factor}
            </motion.div>

            {/* Linia połączenia z centrum */}
            <motion.div
              className="absolute top-1/2 left-1/2 origin-left bg-gradient-to-r from-cyan-400/40 to-transparent"
              style={{
                width: Math.sqrt(position.x ** 2 + position.y ** 2),
                height: 1,
                transform: `translate(-50%, -50%) rotate(${Math.atan2(position.y, position.x)}rad)`,
                opacity: isSelected || isHovered ? 0.8 : 0.2
              }}
              animate={{
                opacity: isSelected || isHovered ? 0.8 : 0.2
              }}
            />

            {/* Tooltip z informacjami */}
            {(isHovered || isSelected) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-slate-800 border border-slate-600 rounded-lg p-3 min-w-[200px] z-30"
              >
                <div className="text-center">
                  <h4 className="text-cyan-300 font-semibold mb-1">
                    {BBT_FACTORS[factor].name}
                  </h4>
                  <div className="text-xs text-slate-300 mb-2">
                    Wektor: <span className={rawData.prymalne[factor]?.wektor >= 0 ? 'text-green-400' : 'text-red-400'}>
                      {rawData.prymalne[factor]?.wektor >= 0 ? '+' : ''}{rawData.prymalne[factor]?.wektor}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {factorDetails[factor]?.interpretation}
                  </p>
                </div>
                
                {/* Strzałka tooltipa */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-slate-800"></div>
              </motion.div>
            )}
          </motion.div>
        );
      })}

      {/* Efekty wizualne */}
      <motion.div
        animate={{ rotate: isRotating ? -360 : 0 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 pointer-events-none"
      >
        {/* Pulsujące punkty energii */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full"
            style={{
              top: '50%',
              left: '50%',
              transform: `rotate(${i * 120}deg) translateX(100px)`
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.5, 1.5, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.7
            }}
          />
        ))}
      </motion.div>

      {/* Kontrolki */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        <motion.button
          onClick={toggleRotation}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="px-3 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-full border border-slate-600/50 hover:bg-slate-600/50"
        >
          {isRotating ? '⏸️ Pauza' : '▶️ Obróć'}
        </motion.button>
        
        {selectedFactor && (
          <motion.button
            onClick={() => onFactorSelect(null)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="px-3 py-1 bg-cyan-600/50 text-cyan-300 text-xs rounded-full border border-cyan-500/50 hover:bg-cyan-500/50"
          >
            ✖️ Wyczyść
          </motion.button>
        )}
      </div>
    </div>
  );
};

CoreEssence.propTypes = {
  data: PropTypes.object.isRequired,
  selectedFactor: PropTypes.string,
  onFactorSelect: PropTypes.func.isRequired,
};
