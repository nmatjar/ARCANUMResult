import React from 'react';
import { FeatureCard } from './FeatureCard';
import { useUserContext } from '../contexts/UserContext';
import '../assets/styles/FeaturesGrid.css';

export const FeaturesGrid = ({ features, onSelectFeature, activeFeature }) => {
  const { userData } = useUserContext();
  return (
    <div className="features-container">
      <div className="features-header">
        <div className="badge">Wyniki Odblokowane</div>
        <h2>Wybierz funkcję, którą chcesz wypróbować</h2>
        <p>Twój kod testu kariery daje Ci dostęp do wszystkich poniższych funkcji AI. Masz obecnie <strong>{userData?.tokens || 0}</strong> jednostek energii.</p>
      </div>
      
      <div className="features-grid">
        {features.map((feature) => (
          <FeatureCard
            key={feature.id}
            feature={feature}
            onClick={() => onSelectFeature(feature.id)}
            isActive={activeFeature === feature.id}
          />
        ))}
      </div>
    </div>
  );
};