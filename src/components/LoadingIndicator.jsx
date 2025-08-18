import React from 'react';
import '../assets/styles/LoadingIndicator.css';

export const LoadingIndicator = () => {
  // Update steps as the loading progresses
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = [
    { icon: 'fa-solid fa-database', label: 'Pobieranie danych' },
    { icon: 'fa-solid fa-robot', label: 'Analiza AI' },
    { icon: 'fa-solid fa-file-lines', label: 'Generowanie raportu' }
  ];

  // Simulate progress through steps
  React.useEffect(() => {
    const step1Timeout = setTimeout(() => setActiveStep(1), 1500);
    const step2Timeout = setTimeout(() => setActiveStep(2), 3500);

    return () => {
      clearTimeout(step1Timeout);
      clearTimeout(step2Timeout);
    };
  }, []);

  return (
    <div className="loading-overlay" role="alert" aria-busy="true">
      <div className="loading-container">
        <div className="ai-brain-animation">
          <i className="fa-solid fa-brain pulse"></i>
          <div className="ai-circles">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <h3 className="loading-title">Analizuję Twoje dane...</h3>
        <div className="loading-steps">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className={`step ${index === activeStep ? 'active' : ''} ${index < activeStep ? 'completed' : ''}`}
            >
              <i className={step.icon}></i>
              <span>{step.label}</span>
            </div>
          ))}
        </div>
        <div className="skeleton-preview">
          <div className="skeleton-header"></div>
          <div className="skeleton-text"></div>
          <div className="skeleton-text"></div>
          <div className="skeleton-text short"></div>
          <div className="skeleton-subheader"></div>
          <div className="skeleton-text"></div>
          <div className="skeleton-text"></div>
        </div>
      </div>
    </div>
  );
};