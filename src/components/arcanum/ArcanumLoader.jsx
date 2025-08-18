import { motion } from 'framer-motion';

/**
 * ARCĀNUM Loader - Elegancki loader dla Results Portal
 */
export const ArcanumLoader = ({ message = "Ładowanie analizy ARCĀNUM..." }) => {
  return (
    <div className="arcanum-loader">
      <div className="loader-container">
        {/* ARCĀNUM Logo Animation */}
        <motion.div 
          className="loader-logo"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            className="loader-title"
            animate={{ 
              textShadow: [
                "0 0 20px rgba(212,175,55,0.5)",
                "0 0 40px rgba(212,175,55,0.8)",
                "0 0 20px rgba(212,175,55,0.5)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ARCĀNUM
          </motion.h1>
          <div className="loader-subtitle">心钥</div>
        </motion.div>

        {/* Animated Circles */}
        <div className="loader-circles">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="loader-circle"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.4
              }}
            />
          ))}
        </div>

        {/* Progress Bar */}
        <div className="loader-progress">
          <motion.div 
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </div>

        {/* Loading Message */}
        <motion.p 
          className="loader-message"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          {message}
        </motion.p>

        {/* Floating Particles */}
        <div className="loader-particles">
          {[...Array(6)].map((_, index) => (
            <motion.div
              key={index}
              className="particle"
              animate={{
                y: [0, -100, 0],
                x: [0, Math.random() * 40 - 20, 0],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
              style={{
                left: `${10 + index * 15}%`,
                bottom: '20%'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Dodaj style do CSS
const loaderStyles = `
.arcanum-loader {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--arcanum-gradient-hero);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.arcanum-loader::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 30% 70%, rgba(212,175,55,0.1) 0%, transparent 50%),
    radial-gradient(circle at 70% 30%, rgba(45,80,22,0.1) 0%, transparent 50%);
  pointer-events: none;
}

.loader-container {
  text-align: center;
  position: relative;
  z-index: 2;
}

.loader-logo {
  margin-bottom: var(--arcanum-spacing-xl);
}

.loader-title {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 700;
  color: var(--arcanum-swiss-gold);
  letter-spacing: 0.1em;
  margin-bottom: var(--arcanum-spacing-xs);
  font-family: var(--arcanum-font-display);
}

.loader-subtitle {
  font-size: clamp(1rem, 2.5vw, 1.5rem);
  color: var(--arcanum-premium-silver);
  font-weight: 300;
}

.loader-circles {
  display: flex;
  justify-content: center;
  gap: var(--arcanum-spacing-sm);
  margin: var(--arcanum-spacing-xl) 0;
}

.loader-circle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--arcanum-swiss-gold);
  box-shadow: 0 0 20px rgba(212,175,55,0.5);
}

.loader-progress {
  width: 300px;
  height: 4px;
  background: rgba(255,255,255,0.2);
  border-radius: 2px;
  margin: var(--arcanum-spacing-lg) auto;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--arcanum-swiss-gold), var(--arcanum-premium-silver));
  border-radius: 2px;
  box-shadow: 0 0 10px rgba(212,175,55,0.5);
}

.loader-message {
  color: rgba(255,255,255,0.8);
  font-size: 1.1rem;
  font-weight: 300;
  margin-top: var(--arcanum-spacing-lg);
}

.loader-particles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: var(--arcanum-swiss-gold);
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(212,175,55,0.8);
}

@media (max-width: 768px) {
  .loader-progress {
    width: 250px;
  }
  
  .loader-message {
    font-size: 1rem;
    padding: 0 var(--arcanum-spacing-lg);
  }
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = loaderStyles;
  document.head.appendChild(styleSheet);
}
