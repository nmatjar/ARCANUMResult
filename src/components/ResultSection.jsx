import React, { useEffect, useState } from 'react';
import { ShareButtons } from './ShareButtons';
import { useUserContext } from '../contexts/UserContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ProfileSuggestions from './ProfileSuggestions';
import { analyzeResponseForProfileData } from '../services/profileSuggestionService';
import { addProfileItem } from '../services/profileExtensionsService';
import '../assets/styles/ResultSection.css';

import { AIAssistantResult } from './AIAssistantResult';

export const ResultSection = ({ result, feature, onBackClick }) => {
  // Sprawdź, czy to funkcja asystenta AI
  if (feature?.useAIAssistant) {
    return <AIAssistantResult feature={feature} onBackClick={onBackClick} />;
  }
  const { refreshResult, userData, updateUserData } = useUserContext();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showZoomedImage, setShowZoomedImage] = useState(false);
  const [profileSuggestions, setProfileSuggestions] = useState([]);
  
  // Preprocess content for consistent formatting
  const [formattedContent, setFormattedContent] = useState(result?.content || '');
  
  useEffect(() => {
    // Ensure consistent headers format (## Header instead of ##Header)
    if (result?.content) {
      let content = result.content;
      
      // Fix headers with missing spaces
      content = content.replace(/^(#{1,6})([^#\s])/gm, '$1 $2');
      
      // Ensure consistent list formatting
      content = content.replace(/^(\s*)-(?!\s)/gm, '$1- ');
      content = content.replace(/^(\s*)\*(?!\s)/gm, '$1* ');
      
      // Ensure blank lines before and after headers
      content = content.replace(/^(#{1,6}\s.*?)$/gm, '\n$1\n');
      
      // Fix multiple blank lines
      content = content.replace(/\n{3,}/g, '\n\n');
      
      setFormattedContent(content);
      
      // Analizuj odpowiedź w poszukiwaniu informacji do profilu
      console.log("Analizuję odpowiedź w poszukiwaniu danych do profilu:", content.substring(0, 100) + "...");
      analyzeResponseForProfileData(content, userData)
        .then(suggestions => {
          console.log("Znalezione sugestie:", suggestions);
          if (suggestions && suggestions.length > 0) {
            setProfileSuggestions(suggestions);
          }
        })
        .catch(error => console.error("Error analyzing response for profile data:", error));
    }
  }, [result?.content, userData]);

  const handleRefresh = async () => {
    if (feature) {
      await refreshResult(feature.id);
    }
  };
  
  const handleImageLoad = () => {
    setImageLoaded(true);
  };
  
  const handleImageError = (e) => {
    console.error("Image failed to load:", e);
    setImageError(true);
    // Set a fallback image if the original fails to load
    e.target.src = `https://placehold.co/600x400/eee/31343C?text=Image+Generation+Failed`;
  };

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
    setShowZoomedImage(true);
  };

  const closeZoomedImage = () => {
    setShowZoomedImage(false);
  };

  const changeImage = (direction) => {
    if (!Array.isArray(result?.imageUrl)) return;
    
    const imageCount = result.imageUrl.length;
    let newIndex = selectedImageIndex + direction;
    
    // Wrap around if needed
    if (newIndex < 0) newIndex = imageCount - 1;
    if (newIndex >= imageCount) newIndex = 0;
    
    setSelectedImageIndex(newIndex);
  };

  return (
    <div className="result-container">
      <div className="result-header">
        <div className={`result-icon ${feature?.iconClass}`}>
          <i className={feature?.icon}></i>
        </div>
        <h2 className="result-title">{feature?.resultTitle || feature?.title}</h2>
      </div>
      
      <div className="result-content">
        {/* Images at the top */}
        {result?.imageUrl && (
          <div className="result-image-container">
            <div className={`image-loader ${!imageLoaded ? 'visible' : 'hidden'}`}>
              <div className="loading-spinner"></div>
              <p>Ładowanie obrazu...</p>
            </div>
            
            {/* Handle both single image URL (string) and multiple images (array) */}
            {Array.isArray(result.imageUrl) ? (
              <>
                {/* Main image display */}
                <img 
                  src={result.imageUrl[selectedImageIndex]} 
                  alt={`Wizualizacja wyników ${selectedImageIndex + 1}`}
                  className={`result-image ${imageLoaded ? 'loaded' : ''}`}
                  loading="lazy"
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  onClick={() => handleImageClick(selectedImageIndex)}
                />
                
                {/* Image thumbnails for selection - only show if we have multiple images */}
                {result.imageUrl.length > 1 && (
                  <div className="image-thumbnails">
                    {result.imageUrl.map((url, index) => (
                      <div 
                        key={index} 
                        className={`image-thumbnail ${index === selectedImageIndex ? 'selected' : ''}`}
                        onClick={() => setSelectedImageIndex(index)}
                      >
                        <img 
                          src={url} 
                          alt={`Wariant ${index + 1}`} 
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Navigation arrows for multiple images */}
                {result.imageUrl.length > 1 && (
                  <div className="image-navigation">
                    <button 
                      className="nav-button prev" 
                      onClick={(e) => { e.stopPropagation(); changeImage(-1); }}
                      aria-label="Poprzedni obraz"
                    >
                      <i className="fa-solid fa-chevron-left"></i>
                    </button>
                    <span className="image-counter">{selectedImageIndex + 1} / {result.imageUrl.length}</span>
                    <button 
                      className="nav-button next" 
                      onClick={(e) => { e.stopPropagation(); changeImage(1); }}
                      aria-label="Następny obraz"
                    >
                      <i className="fa-solid fa-chevron-right"></i>
                    </button>
                  </div>
                )}
              </>
            ) : (
              // Single image case (backward compatibility)
              <img 
                src={result.imageUrl} 
                alt="Wizualizacja wyników" 
                className={`result-image ${imageLoaded ? 'loaded' : ''}`}
                loading="lazy"
                onLoad={handleImageLoad}
                onError={handleImageError}
                onClick={() => setShowZoomedImage(true)}
              />
            )}
            
            {/* Image attribution */}
            <div className="image-attribution">
              <small>
                {result.imageAttribution || "AI-generated image by ImagineAPI"}
              </small>
            </div>
          </div>
        )}
        
        {/* Text content below the images */}
        <div className="markdown-content">
          {formattedContent ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {formattedContent}
            </ReactMarkdown>
          ) : (
            'Brak treści'
          )}
        </div>
        
        {/* Komponent sugestii do profilu */}
        <ProfileSuggestions 
          suggestions={profileSuggestions}
          onAccept={(suggestion) => {
            try {
              // Dodanie do profilu
              addProfileItem(
                userData.id,
                suggestion.field,
                suggestion.value,
                feature.id
              ).then(() => {
                // Aktualizacja lokalnych danych
                updateUserData();
                
                // Usuń z listy sugestii
                setProfileSuggestions(prev => 
                  prev.filter(s => !(s.field === suggestion.field && s.value === suggestion.value))
                );
                
                // Powiadomienie użytkownika - powinno być zastąpione systemem notyfikacji
                console.log(`Dodano "${suggestion.value}" do profilu`);
              });
            } catch (error) {
              console.error("Error saving suggestion:", error);
            }
          }}
          onReject={(suggestion) => {
            // Usunięcie z listy sugestii
            setProfileSuggestions(prev => 
              prev.filter(s => !(s.field === suggestion.field && s.value === suggestion.value))
            );
          }}
        />
        
        {/* Zoomed image modal */}
        {showZoomedImage && (
          <div className="image-zoom-modal" onClick={closeZoomedImage}>
            <div className="zoom-modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="close-zoom-button" onClick={closeZoomedImage}>
                <i className="fa-solid fa-times"></i>
              </button>
              <img 
                src={Array.isArray(result.imageUrl) ? result.imageUrl[selectedImageIndex] : result.imageUrl} 
                alt="Powiększony obraz" 
                className="zoomed-image"
              />
              
              {/* Navigation for zoomed image */}
              {Array.isArray(result.imageUrl) && result.imageUrl.length > 1 && (
                <div className="zoomed-image-navigation">
                  <button 
                    className="nav-button prev" 
                    onClick={(e) => { e.stopPropagation(); changeImage(-1); }}
                    aria-label="Poprzedni obraz"
                  >
                    <i className="fa-solid fa-chevron-left"></i>
                  </button>
                  <span className="image-counter">{selectedImageIndex + 1} / {result.imageUrl.length}</span>
                  <button 
                    className="nav-button next" 
                    onClick={(e) => { e.stopPropagation(); changeImage(1); }}
                    aria-label="Następny obraz"
                  >
                    <i className="fa-solid fa-chevron-right"></i>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      <div className="result-actions">
        <div className="left-actions">
          <button className="secondary-button" onClick={onBackClick}>
            <i className="fa-solid fa-chevron-left"></i> 
            <span>Powrót do funkcji</span>
          </button>
          
          <button className="refresh-button" onClick={handleRefresh}>
            <i className="fa-solid fa-arrows-rotate"></i>
            <span>Wygeneruj ponownie</span>
          </button>
        </div>
        
        <ShareButtons resultData={result} featureTitle={feature?.title} />
      </div>
    </div>
  );
};