import React from 'react';
import '../assets/styles/FeatureCard.css';
import { TOKEN_COSTS } from '../config/featuresConfig';

export const FeatureCard = ({ feature, onClick, isActive }) => {
  // Enhanced icons mapping based on feature type
  const getEnhancedIcon = (iconClass) => {
    // Use enhanced Font Awesome icons
    switch(feature.id) {
      case 'ai-assistant':
        return <><i className="fa-solid fa-robot"></i><i className="fa-solid fa-message fa-xs secondary-icon"></i></>;
      case 'future':
        return <><i className="fa-solid fa-rocket"></i><i className="fa-solid fa-star-half-stroke fa-xs secondary-icon"></i></>;
      case 'studies':
        return <><i className="fa-solid fa-graduation-cap"></i><i className="fa-solid fa-book fa-xs secondary-icon"></i></>;
      case 'activities':
        return <><i className="fa-solid fa-list-check"></i><i className="fa-solid fa-pen-to-square fa-xs secondary-icon"></i></>;
      case 'workplace':
        return <><i className="fa-solid fa-building"></i><i className="fa-solid fa-briefcase fa-xs secondary-icon"></i></>;
      case 'creative':
        return <><i className="fa-solid fa-wand-magic-sparkles"></i><i className="fa-solid fa-lightbulb fa-xs secondary-icon"></i></>;
      case 'skills-gap':
        return <><i className="fa-solid fa-stairs"></i><i className="fa-solid fa-arrow-up fa-xs secondary-icon"></i></>;
      case 'work-life-balance':
        return <><i className="fa-solid fa-scale-balanced"></i><i className="fa-solid fa-heart fa-xs secondary-icon"></i></>;
      case 'networking':
        return <><i className="fa-solid fa-people-group"></i><i className="fa-solid fa-handshake fa-xs secondary-icon"></i></>;
      case 'personal-brand':
        return <><i className="fa-solid fa-fingerprint"></i><i className="fa-solid fa-hashtag fa-xs secondary-icon"></i></>;
      case 'job-search':
        return <><i className="fa-solid fa-magnifying-glass-dollar"></i><i className="fa-solid fa-file-contract fa-xs secondary-icon"></i></>;
      default:
        return <i className={feature.icon}></i>;
    }
  };

  return (
    <div 
      className={`feature-card ${isActive ? 'active' : ''} ${feature.isPremium ? 'premium-feature' : ''}`} 
      onClick={onClick}
    >
      {feature.isPremium && (
        <div className="premium-badge">
          <i className="fa-solid fa-crown"></i>
          <span>Premium</span>
        </div>
      )}
      <div className={`feature-icon ${feature.iconClass}`}>
        {getEnhancedIcon(feature.iconClass)}
      </div>
      <h3 className="feature-title">{feature.title}</h3>
      <p className="feature-desc">{feature.description}</p>
      <div className="feature-cost">
        <i className="fa-solid fa-bolt"></i>
        <span>{TOKEN_COSTS[feature.id] || 100} jednostek energii</span>
      </div>
    </div>
  );
};